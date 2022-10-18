import { Request } from "express";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import Vehicle from "../models/Vehicle";
import { appCommonTypes } from "../@types/app-common";
import Transaction from "../models/Transaction";
import Job from "../models/Job";
import HttpResponse = appCommonTypes.HttpResponse;

export default class VehicleController {
  public static async vehicleSubscriptions(req: Request) {
    const vehicleId = req.params.vehicleId as string;
    const path = req.path;

    try {
      const vehicle = await dataSources.vehicleDAOService.findById(+vehicleId);

      if (!vehicle)
        return Promise.reject(
          CustomAPIError.response(
            `Vehicle with id: ${vehicleId} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      let subscriptions: any[] = [];

      switch (path) {
        case path.match("customer-subs")?.input:
          subscriptions =
            await dataSources.customerSubscriptionDAOService.findAll({
              include: [
                { model: Vehicle, where: { id: +vehicleId } },
                Transaction,
                Job,
              ],
            });
          break;
        case path.match("driver-subs")?.input:
          subscriptions =
            await dataSources.rideShareDriverSubscriptionDAOService.findAll({
              include: [
                { model: Vehicle, where: { id: +vehicleId } },
                Transaction,
                Job,
              ],
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
}
