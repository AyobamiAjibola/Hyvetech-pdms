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
  JOB_STATUS,
  MOBILE_CATEGORY,
} from "../config/constants";
import Plan from "../models/Plan";
import Generic from "../utils/Generic";
import HttpResponse = appCommonTypes.HttpResponse;

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

  public static async assignDriverJob(req: Request) {
    try {
      const partnerId = req.params.partnerId as string;

      const { value, error } = Joi.object({
        subscriptionId: Joi.number().required().label("Subscription Id"),
        techId: Joi.number().required().label("Technician Id"),
        partnerId: Joi.number().required().label("Partner Id"),
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

      const checkLists = await partner.$get("checkLists");

      if (!checkLists.length)
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

      //associate job with check list
      await job.$set("checkList", checkLists[0]);

      //associate job with vehicle
      await job.$set("vehicle", vehicle[0]);

      //associate job with subscription
      await job.$set("rideShareDriverSubscription", rideShareSub);

      //associate partner with job
      await partner.$set("jobs", [job]);

      //associate technician with jobs
      await technician.$set("jobs", [job]);

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
      await job.$set("vehicle", vehicle[0]);

      //associate job with subscription
      await job.$set("customerSubscription", customerSub);

      //associate partner with job
      await partner.$set("jobs", [job]);

      //associate technician with jobs
      await technician.$set("jobs", [job]);

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
