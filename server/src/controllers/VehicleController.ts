import { Request } from "express";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import Vehicle, { $vinSchema } from "../models/Vehicle";
import { appCommonTypes } from "../@types/app-common";
import Transaction from "../models/Transaction";
import Job from "../models/Job";
import Joi from "joi";
import { VINData } from "../services/dao/VINDecoderProviderDAOService";
import HttpResponse = appCommonTypes.HttpResponse;

export default class VehicleController {
  public static async vehicleSubscriptions(req: Request) {
    const vehicleId = req.params.vehicleId as string;
    const path = req.path;

    try {
      const vehicle = await dataSources.vehicleDAOService.findById(+vehicleId);

      if (!vehicle)
        return Promise.reject(
          CustomAPIError.response(`Vehicle with id: ${vehicleId} does not exist`, HttpStatus.NOT_FOUND.code)
        );

      let subscriptions: any[] = [];

      switch (path) {
        case path.match("customer-subs")?.input:
          subscriptions = await dataSources.customerSubscriptionDAOService.findAll({
            include: [{ model: Vehicle, where: { id: +vehicleId } }, Transaction, Job],
          });
          break;
        case path.match("driver-subs")?.input:
          subscriptions = await dataSources.rideShareDriverSubscriptionDAOService.findAll({
            include: [{ model: Vehicle, where: { id: +vehicleId } }, Transaction, Job],
          });
          break;
        default:
      }

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: subscriptions,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async getVIN(req: Request) {
    const { error, value } = Joi.object($vinSchema).validate(req.query);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const vin = value.vin;

    try {
      const defaultProvider = await dataSources.vinDecoderProviderDAOService.findByAny({
        where: { default: true },
      });

      if (!defaultProvider) {
        return Promise.reject(CustomAPIError.response(`No default provider`, HttpStatus.NOT_FOUND.code));
      }

      //use the first provider to make the API request
      const vinData = await dataSources.vinDecoderProviderDAOService.decodeVIN(vin, defaultProvider);

      if (!vinData.length)
        return Promise.reject(
          CustomAPIError.response(`Could not find matching result for vin: ${vin}`, HttpStatus.NOT_FOUND.code)
        );

      const response: HttpResponse<VINData> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: vinData,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
