import { Request } from "express";
import Joi from "joi";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import RideShareDriverSubscription from "../models/RideShareDriverSubscription";
import CustomerSubscription from "../models/CustomerSubscription";
import Technician from "../models/Technician";
import { appCommonTypes } from "../@types/app-common";
import Job from "../models/Job";
import RideShareDriver from "../models/RideShareDriver";
import Customer from "../models/Customer";
import {
  DRIVE_IN_CATEGORY,
  HYBRID_CATEGORY,
  INITIAL_CHECK_LIST_VALUES,
  JOB_STATUS,
  MOBILE_CATEGORY,
  UPLOAD_BASE_PATH,
} from "../config/constants";
import Plan from "../models/Plan";
import Generic from "../utils/Generic";
import Vehicle from "../models/Vehicle";
import Partner from "../models/Partner";
import Contact from "../models/Contact";
import formidable, { File } from "formidable";
import HttpResponse = appCommonTypes.HttpResponse;
import CheckListType = appCommonTypes.CheckListType;

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

export default class JobController {
  public static async jobs(partnerId?: number) {
    let jobs: Job[] = [];

    try {
      if (partnerId) {
        const partner = await dataSources.partnerDAOService.findById(partnerId);

        if (!partner)
          return Promise.reject(
            CustomAPIError.response(
              `Partner with Id: ${partnerId} does not exist`,
              HttpStatus.NOT_FOUND.code
            )
          );

        jobs = await partner.$get("jobs", {
          include: [
            RideShareDriverSubscription,
            CustomerSubscription,
            Technician,
          ],
        });
      }

      jobs = await dataSources.jobDAOService.findAll({
        include: [
          RideShareDriverSubscription,
          CustomerSubscription,
          Technician,
        ],
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

      if (job && typeof job.checkList !== "object") {
        const checkList = JSON.parse(job.checkList) as unknown as CheckListType;

        if (checkList.sections) {
          checkList.sections = checkList.sections.map((section) => {
            if (typeof section !== "string") return section;
            else return JSON.parse(section as unknown as string);
          });
        } else
          checkList.sections = JSON.parse(
            JSON.stringify([INITIAL_CHECK_LIST_VALUES])
          );

        result = Object.assign(
          {},
          {
            ...job.toJSON(),
            checkList,
          }
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

  public static async assignDriverJob(req: Request) {
    try {
      const partnerId = req.params.partnerId as string;

      const { value, error } = Joi.object({
        subscriptionId: Joi.number().required().label("Subscription Id"),
        techId: Joi.number().required().label("Technician Id"),
        partnerId: Joi.number().required().label("Partner Id"),
        checkListId: Joi.number().required().label("Check List Id"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with Id: ${partnerId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const checkList = await dataSources.checkListDAOService.findById(
        value.checkListId
      );

      if (!checkList)
        return Promise.reject(
          CustomAPIError.response(
            `Check List does not exist. You need a check list to carry out inspection`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const technician = await dataSources.technicianDAOService.findById(
        +value.techId
      );

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `Technician does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const jobValues: any = {
        status: JOB_STATUS.pending,
        hasJob: true,
      };

      const rideShareSub =
        await dataSources.rideShareDriverSubscriptionDAOService.findById(
          +value.subscriptionId
        );

      if (!rideShareSub)
        return Promise.reject(
          CustomAPIError.response(
            `Subscription does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const vehicle = await rideShareSub.$get("vehicles", {
        include: [RideShareDriver],
      });

      if (!vehicle.length)
        return Promise.reject(
          CustomAPIError.response(
            `Vehicle not subscribed to plan`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const planLabel = Generic.generateSlug(`${rideShareSub.planType}`);

      const plan = await dataSources.planDAOService.findByAny({
        where: {
          label: planLabel,
        },
      });

      if (!plan)
        return Promise.reject(
          CustomAPIError.response(
            `Plan: ${planLabel} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const owner = vehicle[0].rideShareDriver;

      Object.assign(jobValues, {
        type: rideShareSub.programme,
        name: `${rideShareSub.planType} Job`,
        vehicleOwner: `${owner.firstName} ${owner.lastName}`,
      });

      const job = await dataSources.jobDAOService.create(jobValues);

      //associate job with vehicle
      await vehicle[0].$add("jobs", [job]);

      //associate job with subscription
      await rideShareSub.$add("jobs", [job]);

      //create job check list
      await job.update({ checkList: JSON.stringify(checkList.toJSON()) });

      //associate partner with job
      await partner.$add("jobs", [job]);

      //associate technician with jobs
      await technician.$add("jobs", [job]);

      //update technician job status
      await technician.update({ hasJob: true });

      //update vehicle job status
      if (rideShareSub.programme.match(new RegExp("inspection", "i"))?.input)
        await vehicle[0].update({ onInspection: true });

      if (rideShareSub.programme.match(new RegExp("maintenance", "i"))?.input)
        await vehicle[0].update({ onMaintenance: true });

      //increment mode of service count
      await this.incrementServiceModeCount(plan, rideShareSub);

      const jobs = await partner.$get("jobs");

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

  public static async assignCustomerJob(req: Request) {
    try {
      const partnerId = req.params.partnerId as string;

      const { value, error } = Joi.object({
        subscriptionId: Joi.number().required().label("Subscription Id"),
        techId: Joi.number().required().label("Technician Id"),
        partnerId: Joi.number().required().label("Partner Id"),
        checkListId: Joi.number().required().label("Check List Id"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner with Id: ${partnerId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const checkList = await dataSources.checkListDAOService.findById(
        value.checkListId
      );

      if (!checkList)
        return Promise.reject(
          CustomAPIError.response(
            `Check List does not exist. You need a check list to carry out inspection`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const technician = await dataSources.technicianDAOService.findById(
        +value.techId
      );

      if (!technician)
        return Promise.reject(
          CustomAPIError.response(
            `Technician does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const jobValues: any = {
        status: JOB_STATUS.pending,
      };

      const customerSub =
        await dataSources.customerSubscriptionDAOService.findById(
          +value.subscriptionId
        );

      if (!customerSub)
        return Promise.reject(
          CustomAPIError.response(
            `Subscription does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const vehicle = await customerSub.$get("vehicles", {
        include: [Customer],
      });

      if (!vehicle.length)
        return Promise.reject(
          CustomAPIError.response(
            `Vehicle not subscribed to plan`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const planLabel = Generic.generateSlug(`${customerSub.planType}`);

      const plan = await dataSources.planDAOService.findByAny({
        where: {
          label: planLabel,
        },
      });

      if (!plan)
        return Promise.reject(
          CustomAPIError.response(
            `Plan: ${planLabel} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const owner = vehicle[0].customer;

      Object.assign(jobValues, {
        type: customerSub.programme,
        name: `${customerSub.planType} Job`,
        vehicleOwner: `${owner.firstName} ${owner.lastName}`,
      });

      const job = await dataSources.jobDAOService.create(jobValues);

      //associate job with vehicle
      await vehicle[0].$add("jobs", [job]);

      //associate job with subscription
      await customerSub.$add("jobs", [job]);

      //associate job with check list
      await job.update({ checkList: JSON.stringify(checkList.toJSON()) });

      //associate partner with job
      await partner.$add("jobs", [job]);

      //associate technician with jobs
      await technician.$add("jobs", [job]);

      //update technician job status
      await technician.update({ hasJob: true });

      //update vehicle job status
      if (customerSub.programme.match(new RegExp("inspection", "i"))?.input)
        await vehicle[0].update({ onInspection: true });

      if (customerSub.programme.match(new RegExp("maintenance", "i"))?.input)
        await vehicle[0].update({ onMaintenance: true });

      //increment mode of service count
      await this.incrementServiceModeCount(plan, customerSub);

      const jobs = await partner.$get("jobs");

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

  public static async approveJobCheckList(req: Request) {
    const jobId = req.params.jobId as string;

    try {
      const { error, value } = Joi.object({
        jobId: Joi.number().required().label("Job Id"),
        approved: Joi.boolean().required().label("Approved"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const job = await dataSources.jobDAOService.findById(+jobId, {
        include: [
          RideShareDriverSubscription,
          CustomerSubscription,
          Technician,
          Vehicle,
          { model: Partner, include: [Contact] },
        ],
      });

      if (!job)
        return Promise.reject(
          CustomAPIError.response(
            `Job does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const checkList = job.checkList;

      if (!checkList.length)
        return Promise.reject(
          CustomAPIError.response(
            `Can not approve job, checklist does not available.`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const iCheckList = JSON.parse(checkList) as unknown as CheckListType;

      let message;

      if (value.approved) message = "Approved";
      else message = "Not approved";

      iCheckList.approvedByGarageAdmin = value.approved;

      await job.update({
        checkList: JSON.stringify(iCheckList),
      });

      const list = JSON.parse(job.checkList) as unknown as CheckListType;

      const result = {
        ...job.toJSON(),
        checkList: list,
      };

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

  public static async updateJobVehicle(
    req: Request
  ): Promise<HttpResponse<Vehicle>> {
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          const { error, value } = Joi.object({
            vehicleInfo: Joi.string().required().label("Vehicle Info"),
          }).validate(fields);

          if (error)
            return reject(
              CustomAPIError.response(
                error.details[0].message,
                HttpStatus.BAD_REQUEST.code
              )
            );

          const jobId = req.params.jobId as string;
          const job = await dataSources.jobDAOService.findById(+jobId);

          if (!job)
            return reject(
              CustomAPIError.response(
                `Job does not exist`,
                HttpStatus.NOT_FOUND.code
              )
            );

          const vehicle = await job.$get("vehicle");

          if (!vehicle)
            return reject(
              CustomAPIError.response(
                `Vehicle does not exist`,
                HttpStatus.NOT_FOUND.code
              )
            );

          const vehicleInfo = JSON.parse(value.vehicleInfo);

          const basePath = `${UPLOAD_BASE_PATH}/vehicles`;
          const updateData: { [p: string]: any } = {
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            modelYear: vehicleInfo.modelYear,
            plateNumber: vehicleInfo.plateNumber,
            vin: vehicleInfo.vin,
            mileageUnit: vehicleInfo.mileageUnit,
            mileageValue: vehicleInfo.mileageValue,
            frontTireSpec: vehicleInfo.frontTireSpec,
            rearTireSpec: vehicleInfo.rearTireSpec,
          };

          for (const file of Object.keys(files)) {
            const { originalFilename, filepath } = files[file] as File;

            Object.assign(updateData, {
              [file]: await Generic.getImagePath({
                basePath,
                tempPath: filepath,
                filename: <string>originalFilename,
              }),
            });
          }

          const result = await vehicle.update(updateData);

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

  private static async incrementServiceModeCount(
    plan: Plan,
    subscription: RideShareDriverSubscription | CustomerSubscription
  ) {
    const defaultMobileInspections = plan.mobile;
    const defaultDriveInInspections = plan.driveIn;

    let mobileCount = subscription.mobileCount;
    let driveInCount = subscription.driveInCount;

    if (subscription.planCategory === HYBRID_CATEGORY) {
      //Hybrid mobile
      if (
        subscription.modeOfService !== MOBILE_CATEGORY &&
        mobileCount < defaultMobileInspections
      )
        mobileCount++;
      else
        return this.getInspectionsCountError(
          subscription.planType,
          MOBILE_CATEGORY
        );

      //Hybrid drive-in
      if (
        subscription.modeOfService !== DRIVE_IN_CATEGORY &&
        driveInCount < defaultDriveInInspections
      )
        driveInCount++;
      else
        return this.getInspectionsCountError(
          subscription.planType,
          DRIVE_IN_CATEGORY
        );
    }

    if (
      subscription.planCategory === MOBILE_CATEGORY &&
      mobileCount === defaultMobileInspections
    )
      return this.getInspectionsCountError(
        subscription.planType,
        MOBILE_CATEGORY
      );
    else mobileCount++; //Increment count for mobile drive-in inspection

    if (
      subscription.planCategory === DRIVE_IN_CATEGORY &&
      driveInCount === defaultDriveInInspections
    )
      return this.getInspectionsCountError(
        subscription.planType,
        DRIVE_IN_CATEGORY
      );
    else driveInCount++; //Increment count for normal drive-in inspection

    await subscription.update({
      mobileCount,
      driveInCount,
      inspections: mobileCount + driveInCount,
    });
  }

  private static getInspectionsCountError(
    subscriptionName: string,
    category: string
  ) {
    return Promise.reject(
      CustomAPIError.response(
        `Maximum number of ${category} inspections reached for plan ${subscriptionName}`,
        HttpStatus.BAD_REQUEST.code
      )
    );
  }
}
