import { Request } from 'express';
import Joi from 'joi';

import dataSources from '../services/dao';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import RideShareDriverSubscription from '../models/RideShareDriverSubscription';
import CustomerSubscription from '../models/CustomerSubscription';
import Technician from '../models/Technician';
import { appCommonTypes } from '../@types/app-common';
import Job from '../models/Job';
import RideShareDriver from '../models/RideShareDriver';
import Customer from '../models/Customer';
import {
  APPROVE_JOB,
  ASSIGN_DRIVER_JOB,
  DRIVE_IN_CATEGORY,
  HYBRID_CATEGORY,
  INITIAL_CHECK_LIST_VALUES,
  JOB_STATUS,
  MOBILE_CATEGORY,
  UPLOAD_BASE_PATH,
} from '../config/constants';
import Plan from '../models/Plan';
import Generic from '../utils/Generic';
import Vehicle from '../models/Vehicle';
import Partner from '../models/Partner';
import Contact from '../models/Contact';
import formidable, { File } from 'formidable';
import { appEventEmitter } from '../services/AppEventEmitter';
import { AssignJobProps } from '../services/socketManager';
import fs from 'fs/promises';
import HttpResponse = appCommonTypes.HttpResponse;
import CheckListType = appCommonTypes.CheckListType;
import AnyObjectType = appCommonTypes.AnyObjectType;

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

const SUBSCRIPTION_ID = 'Subscription Id';
const TECHNICIAN_ID = 'Technician Id';
const PARTNER_ID = 'Partner Id';
const CHECKLIST_ID = 'Check List Id';
export default class JobController {
  public static async jobs(partnerId?: number) {
    let jobs: Job[] = [];

    try {
      if (partnerId) {
        const partner = await dataSources.partnerDAOService.findById(partnerId);

        if (!partner)
          return Promise.reject(
            CustomAPIError.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus.NOT_FOUND.code),
          );

        jobs = await partner.$get('jobs', {
          include: [RideShareDriverSubscription, CustomerSubscription, Technician],
        });
      }

      jobs = await dataSources.jobDAOService.findAll({
        include: [RideShareDriverSubscription, CustomerSubscription, Technician],
      });

      const response: HttpResponse<Job> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: jobs,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async job(req: Request) {
    const jobId = req.params.jobId as string;

    let result: any = null;

    try {
      const job = await dataSources.jobDAOService.findById(+jobId, {
        include: [
          RideShareDriverSubscription,
          CustomerSubscription,
          Technician,
          Vehicle,
          { model: Partner, include: [Contact] },
        ],
      });

      if (job && typeof job.checkList !== 'object') {
        const checkList = JSON.parse(job.checkList);

        if (checkList.sections) {
          checkList.sections = checkList.sections.map((section: unknown) => {
            if (typeof section !== 'string') return section;
            else return JSON.parse(section as unknown as string);
          });
        } else checkList.sections = JSON.parse(JSON.stringify([INITIAL_CHECK_LIST_VALUES]));

        result = Object.assign(
          {},
          {
            ...job.toJSON(),
            checkList,
          },
        );
      } else result = job;

      const response: HttpResponse<Job> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async assignJob(req: Request) {
    try {
      const { value, error } = Joi.object({
        subscriptionId: Joi.any().required().label(SUBSCRIPTION_ID),
        techId: Joi.number().required().label(TECHNICIAN_ID),
        partnerId: Joi.number().required().label(PARTNER_ID),
        checkListId: Joi.number().required().label(CHECKLIST_ID),
        jobId: Joi.number().allow().label('Job Id'),
        client: Joi.string().allow('').label('Client'),
      }).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      if (value.client === 'Driver') return this.assignDriverJob(req);
      if (value.client === 'Customer') return this.assignCustomerJob(req);

      return Promise.reject({
        code: HttpStatus.BAD_REQUEST.code,
        message: HttpStatus.BAD_REQUEST.value,
      } as HttpResponse<void>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async assignDriverJob(req: Request) {
    const partnerId = req.params.partnerId as string;
    const value = req.body;

    const partner = await dataSources.partnerDAOService.findById(+partnerId);

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    const checkList = await dataSources.checkListDAOService.findById(value.checkListId);

    if (!checkList)
      return Promise.reject(
        CustomAPIError.response(
          `Check List does not exist. You need a check list to carry out inspection`,
          HttpStatus.NOT_FOUND.code,
        ),
      );

    const technician = await dataSources.technicianDAOService.findById(+value.techId);

    if (!technician)
      return Promise.reject(CustomAPIError.response(`Technician does not exist`, HttpStatus.NOT_FOUND.code));

    const jobValues: any = {
      status: JOB_STATUS.pending,
      hasJob: true,
    };

    const rideShareSub = await dataSources.rideShareDriverSubscriptionDAOService.findById(+value.subscriptionId);

    if (!rideShareSub)
      return Promise.reject(CustomAPIError.response(`Subscription does not exist`, HttpStatus.NOT_FOUND.code));

    const vehicle = await rideShareSub.$get('vehicles', {
      include: [RideShareDriver],
    });

    if (!vehicle.length)
      return Promise.reject(CustomAPIError.response(`Vehicle not subscribed to plan`, HttpStatus.NOT_FOUND.code));

    const planLabel = Generic.generateSlug(`${rideShareSub.planType}`);

    const plan = await dataSources.planDAOService.findByAny({
      where: {
        label: planLabel,
      },
    });

    if (!plan)
      return Promise.reject(CustomAPIError.response(`Plan: ${planLabel} does not exist`, HttpStatus.NOT_FOUND.code));

    const owner = vehicle[0].rideShareDriver;

    Object.assign(jobValues, {
      type: rideShareSub.programme,
      name: `${rideShareSub.planType} Job`,
      vehicleOwner: `${owner.firstName} ${owner.lastName}`,
    });

    const job = await dataSources.jobDAOService.create(jobValues);

    //associate job with vehicle
    await vehicle[0].$add('jobs', [job]);

    //associate job with subscription
    await rideShareSub.$add('jobs', [job]);

    //create job check list
    await job.update({ checkList: JSON.stringify(checkList.toJSON()) });

    //associate partner with job
    await partner.$add('jobs', [job]);

    //associate technician with jobs
    await technician.$add('jobs', [job]);

    //update technician job status
    await technician.update({ hasJob: true });

    //update vehicle job status
    if (rideShareSub.programme.match(new RegExp('inspection', 'i'))?.input)
      await vehicle[0].update({ onInspection: true });

    if (rideShareSub.programme.match(new RegExp('maintenance', 'i'))?.input)
      await vehicle[0].update({ onMaintenance: true });

    //increment mode of service count
    await this.incrementServiceModeCount(plan, rideShareSub);

    const jobs = await partner.$get('jobs');

    appEventEmitter.emit(ASSIGN_DRIVER_JOB, {
      techId: +value.techId,
      partner,
    } as AssignJobProps);

    const response: HttpResponse<Job> = {
      code: HttpStatus.OK.code,
      message: `Assigned Job Successfully.`,
      results: jobs,
    };

    return Promise.resolve(response);
  }

  public static async assignCustomerJob(req: Request) {
    const partnerId = req.params.partnerId as string;

    const value = req.body;

    const partner = await dataSources.partnerDAOService.findById(+partnerId);

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    const checkList = await dataSources.checkListDAOService.findById(value.checkListId);

    if (!checkList)
      return Promise.reject(
        CustomAPIError.response(
          `Check List does not exist. You need a check list to carry out inspection`,
          HttpStatus.NOT_FOUND.code,
        ),
      );

    const technician = await dataSources.technicianDAOService.findById(+value.techId);

    if (!technician)
      return Promise.reject(CustomAPIError.response(`Technician does not exist`, HttpStatus.NOT_FOUND.code));

    const jobValues: any = {
      status: JOB_STATUS.pending,
    };

    const customerSub = await dataSources.customerSubscriptionDAOService.findById(+value.subscriptionId);

    if (!customerSub)
      return Promise.reject(CustomAPIError.response(`Subscription does not exist`, HttpStatus.NOT_FOUND.code));

    const vehicle = await customerSub.$get('vehicles', {
      include: [Customer],
    });

    if (!vehicle.length)
      return Promise.reject(CustomAPIError.response(`Vehicle not subscribed to plan`, HttpStatus.NOT_FOUND.code));

    const planLabel = Generic.generateSlug(`${customerSub.planType}`);

    const plan = await dataSources.planDAOService.findByAny({
      where: {
        label: planLabel,
      },
    });

    const owner = vehicle[0].customer;

    Object.assign(jobValues, {
      type: customerSub.programme,
      name: `${customerSub.planType} Job`,
      vehicleOwner: `${owner.firstName} ${owner.lastName}`,
    });

    const job = await dataSources.jobDAOService.create(jobValues);

    //associate job with vehicle
    await vehicle[0].$add('jobs', [job]);

    //associate job with subscription
    await customerSub.$add('jobs', [job]);

    //associate job with check list
    await job.update({ checkList: JSON.stringify(checkList.toJSON()) });

    //associate partner with job
    await partner.$add('jobs', [job]);

    //associate technician with jobs
    await technician.$add('jobs', [job]);

    //update technician job status
    await technician.update({ hasJob: true });

    //update vehicle job status
    if (customerSub.programme.match(new RegExp('inspection', 'i'))?.input)
      await vehicle[0].update({ onInspection: true });

    if (customerSub.programme.match(new RegExp('maintenance', 'i'))?.input)
      await vehicle[0].update({ onMaintenance: true });

    const jobs = await partner.$get('jobs');

    if (!plan) {
      if (planLabel.search(/estimate/i) !== -1) {
        const response: HttpResponse<Job> = {
          code: HttpStatus.OK.code,
          message: `Assigned Job Successfully.`,
          results: jobs,
        };

        return Promise.resolve(response);
      } else
        return Promise.reject(CustomAPIError.response(`Plan: ${planLabel} does not exist`, HttpStatus.NOT_FOUND.code));
    } else await this.incrementServiceModeCount(plan, customerSub);

    const response: HttpResponse<Job> = {
      code: HttpStatus.OK.code,
      message: `Assigned Job Successfully.`,
      results: jobs,
    };

    return Promise.resolve(response);
  }

  public static async reassignJob(req: Request) {
    try {
      const { error } = Joi.object({
        jobId: Joi.number().required().label('Job Id'),
        client: Joi.string().required().label('Client'),
        subscriptionId: Joi.number().required().label(SUBSCRIPTION_ID),
        techId: Joi.number().required().label(TECHNICIAN_ID),
        partnerId: Joi.number().required().label(PARTNER_ID),
        checkListId: Joi.number().required().label(CHECKLIST_ID),
      }).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      //reassign job
      return this.doReassignJob(req);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async cancelJob(req: Request) {
    try {
      const { error } = Joi.object({
        jobId: Joi.number().required().label('Job Id'),
        client: Joi.string().required().label('Client'),
      }).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      //cancel job
      await this.doCancelJob(req);

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: 'Job canceled successfully.',
      } as HttpResponse<void>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async approveJobCheckList(req: Request) {
    const jobId = req.params.jobId as string;

    try {
      const { error, value } = Joi.object({
        jobId: Joi.number().required().label('Job Id'),
        approved: Joi.boolean().required().label('Approved'),
      }).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const job = await dataSources.jobDAOService.findById(+jobId, {
        include: [
          RideShareDriverSubscription,
          CustomerSubscription,
          Technician,
          Vehicle,
          { model: Partner, include: [Contact] },
        ],
      });

      if (!job) return Promise.reject(CustomAPIError.response(`Job does not exist`, HttpStatus.NOT_FOUND.code));

      const checkList = job.checkList;

      if (!checkList.length)
        return Promise.reject(
          CustomAPIError.response(`Can not approve job, checklist does not available.`, HttpStatus.NOT_FOUND.code),
        );

      const iCheckList = JSON.parse(checkList) as unknown as CheckListType;

      let message;

      if (value.approved) message = 'Approved';
      else message = 'Not approved';

      iCheckList.approvedByGarageAdmin = value.approved;

      await job.update({
        checkList: JSON.stringify(iCheckList),
      });

      const list = JSON.parse(job.checkList) as unknown as CheckListType;

      const result = {
        ...job.toJSON(),
        checkList: list,
      };

      appEventEmitter.emit(APPROVE_JOB, { job: result });

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async updateJobVehicle(req: Request): Promise<HttpResponse<Vehicle>> {
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          const { error, value } = Joi.object({
            vehicleInfo: Joi.string().required().label('Vehicle Info'),
          }).validate(fields);

          if (error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

          const jobId = req.params.jobId as string;
          const job = await dataSources.jobDAOService.findById(+jobId);

          if (!job) return reject(CustomAPIError.response(`Job does not exist`, HttpStatus.NOT_FOUND.code));

          const vehicle = await job.$get('vehicle');

          if (!vehicle) return reject(CustomAPIError.response(`Vehicle does not exist`, HttpStatus.NOT_FOUND.code));

          const vehicleInfo = JSON.parse(value.vehicleInfo);

          const basePath = `${UPLOAD_BASE_PATH}/vehicles`;
          const vehicleUpdateData: AnyObjectType = {
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            modelYear: vehicleInfo.modelYear,
            plateNumber: vehicleInfo.plateNumber,
            vin: vehicleInfo.vin,
            frontTireSpec: vehicleInfo.frontTireSpec,
            rearTireSpec: vehicleInfo.rearTireSpec,
          };

          const jobUpdateData: AnyObjectType = {
            mileageUnit: vehicleInfo.mileageUnit,
            mileageValue: vehicleInfo.mileageValue,
          };

          for (const jobKey in job.toJSON()) {
            if (await Generic.fileExist(jobKey)) await fs.rm(jobKey);
          }

          for (const file of Object.keys(files)) {
            const { originalFilename, filepath } = files[file] as File;

            Object.assign(jobUpdateData, {
              [file]: await Generic.getImagePath({
                basePath,
                tempPath: filepath,
                filename: <string>originalFilename,
              }),
            });
          }

          await job.update(jobUpdateData);

          const result = await vehicle.update(vehicleUpdateData);

          const response: HttpResponse<Vehicle> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result: result,
          };

          resolve(response);
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  public static async uploadJobReport(req: Request): Promise<HttpResponse<void>> {
    const jobId = req.params.jobId as string;

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) return reject(CustomAPIError.response(err, HttpStatus.BAD_REQUEST.code));

          const job = await dataSources.jobDAOService.findById(+jobId);

          if (!job) return reject(CustomAPIError.response(`Job does not exist`, HttpStatus.NOT_FOUND.code));

          if (!job.reportFileUrl) {
            const basePath = `${UPLOAD_BASE_PATH}/reports`;
            const jobUpdateData = {};

            for (const file of Object.keys(files)) {
              const { originalFilename, filepath } = files[file] as File;

              Object.assign(jobUpdateData, {
                [file]: await Generic.getImagePath({
                  basePath,
                  tempPath: filepath,
                  filename: <string>originalFilename,
                }),
              });
            }

            await job.update(jobUpdateData);
          }

          return resolve({
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
          } as HttpResponse<void>);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private static async doReassignJob(req: Request) {
    const partnerId = req.params.partnerId as string;

    const value = req.body;

    const partner = await dataSources.partnerDAOService.findById(+partnerId);

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    const job = await dataSources.jobDAOService.findById(value.jobId);

    if (!job) throw new Error(`Job does not exist`);

    let driverSub: RideShareDriverSubscription | null = null;
    let customerSub: CustomerSubscription | null = null;
    let vehicle: Vehicle[] | null = null;

    const prevTechnician = await job.$get('technician');

    if (!prevTechnician) throw new Error(`Assigned Technician does not exist`);

    await prevTechnician.$remove('jobs', [job]);

    await prevTechnician.update({ hasJob: false });

    const technician = await dataSources.technicianDAOService.findById(value.techId);

    if (!technician) throw new Error(`Reassigned Technician does not exist`);

    if (value.client === 'Driver') driverSub = await job.$get('rideShareDriverSubscription');

    if (value.client === 'Customer') customerSub = await job.$get('customerSubscription');

    if (driverSub) {
      vehicle = await driverSub.$get('vehicles');
      //associate job with subscription
      await driverSub.$add('jobs', [job]);
    }

    if (customerSub) {
      vehicle = await customerSub.$get('vehicles');
      await customerSub.$add('jobs', [job]);
    }

    if (!vehicle) throw new Error(`Vehicle does not exist`);

    //associate job with vehicle
    await vehicle[0].$add('jobs', [job]);

    //associate technician with jobs
    await technician.$add('jobs', [job]);

    //update technician job status
    await technician.update({ hasJob: true });

    const jobs = await partner.$get('jobs');

    appEventEmitter.emit(ASSIGN_DRIVER_JOB, {
      techId: +value.techId,
      partner,
    } as AssignJobProps);

    const response: HttpResponse<Job> = {
      code: HttpStatus.OK.code,
      message: `Reassigned Job Successfully.`,
      results: jobs,
    };

    return Promise.resolve(response);
  }

  private static async doCancelJob(req: Request) {
    const value = req.body;

    const job = await dataSources.jobDAOService.findById(value.jobId);

    if (!job) throw new Error(`Job does not exist`);

    let driverSub: RideShareDriverSubscription | null = null;
    let customerSub: CustomerSubscription | null = null;

    const technician = await job.$get('technician');
    const vehicle = await job.$get('vehicle');

    if (!technician) throw new Error(`Technician does not exist`);
    if (!vehicle) throw new Error(`Vehicle does not exist`);

    if (value.client === 'Driver') driverSub = await job.$get('rideShareDriverSubscription');

    if (value.client === 'Customer') customerSub = await job.$get('customerSubscription');

    if (driverSub) {
      await driverSub.$remove('jobs', [job]);
      await driverSub.update({
        driveInCount: --driverSub.driveInCount,
        mobileCount: --driverSub.mobileCount,
      });
      //update vehicle job status
      if (driverSub.programme.match(new RegExp('inspection', 'i'))?.input)
        await vehicle.update({ onInspection: false });

      if (driverSub.programme.match(new RegExp('maintenance', 'i'))?.input)
        await vehicle.update({ onMaintenance: false });
    }

    if (customerSub) {
      await customerSub.$remove('jobs', [job]);
      await customerSub.update({
        driveInCount: --customerSub.driveInCount,
        mobileCount: --customerSub.mobileCount,
      });
      //update vehicle job status
      if (customerSub.programme.match(new RegExp('inspection', 'i'))?.input)
        await vehicle.update({ onInspection: false });

      if (customerSub.programme.match(new RegExp('maintenance', 'i'))?.input)
        await vehicle.update({ onMaintenance: false });
    }

    await technician.update({
      hasJob: false,
    });

    await technician.$remove('jobs', [job]);
    await vehicle.$remove('jobs', [job]);
    await job.update({
      status: JOB_STATUS.canceled,
    });
  }

  private static async incrementServiceModeCount(
    plan: Plan,
    subscription: RideShareDriverSubscription | CustomerSubscription,
  ) {
    const defaultMobileInspections = plan.mobile;
    const defaultDriveInInspections = plan.driveIn;

    let mobileCount = subscription.mobileCount;
    let driveInCount = subscription.driveInCount;

    if (subscription.planCategory === HYBRID_CATEGORY) {
      //Hybrid mobile
      if (subscription.modeOfService !== MOBILE_CATEGORY && mobileCount < defaultMobileInspections) mobileCount++;
      else return this.getInspectionsCountError(subscription.planType, MOBILE_CATEGORY);

      //Hybrid drive-in
      if (subscription.modeOfService !== DRIVE_IN_CATEGORY && driveInCount < defaultDriveInInspections) driveInCount++;
      else return this.getInspectionsCountError(subscription.planType, DRIVE_IN_CATEGORY);
    }

    if (subscription.planCategory === MOBILE_CATEGORY && mobileCount === defaultMobileInspections)
      return this.getInspectionsCountError(subscription.planType, MOBILE_CATEGORY);
    else mobileCount++; //Increment count for mobile drive-in inspection

    if (subscription.planCategory === DRIVE_IN_CATEGORY && driveInCount === defaultDriveInInspections)
      return this.getInspectionsCountError(subscription.planType, DRIVE_IN_CATEGORY);
    else driveInCount++; //Increment count for normal drive-in inspection

    await subscription.update({
      mobileCount,
      driveInCount,
      inspections: mobileCount + driveInCount,
    });
  }

  private static getInspectionsCountError(subscriptionName: string, category: string) {
    return Promise.reject(
      CustomAPIError.response(
        `Maximum number of ${category} inspections reached for plan ${subscriptionName}`,
        HttpStatus.BAD_REQUEST.code,
      ),
    );
  }
}
