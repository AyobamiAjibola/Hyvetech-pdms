import Joi from "joi";

import { appCommonTypes } from "../@types/app-common";
import HttpStatus from "../helpers/HttpStatus";
import RideShareDriver from "../models/RideShareDriver";
import CustomAPIError from "../exceptions/CustomAPIError";
import dataSources from "../services/dao";
import Vehicle from "../models/Vehicle";
import Appointment from "../models/Appointment";
import Transaction from "../models/Transaction";
import VehicleFault from "../models/VehicleFault";
import { Request } from "express";
import RideShareDriverSubscription from "../models/RideShareDriverSubscription";
import Job from "../models/Job";
import Contact from "../models/Contact";
import { TryCatch } from "../decorators";
import HttpResponse = appCommonTypes.HttpResponse;
import AppRequestParams = appCommonTypes.AppRequestParams;

const DRIVER_ID = "Driver Id";

export default class RideShareDriverController {
  @TryCatch
  public static async allRideShareDrivers() {
    const drivers = await dataSources.rideShareDriverDAOService.findAll({
      attributes: { exclude: ["password", "rawPassword", "loginToken"] },
    });

    const response: HttpResponse<RideShareDriver> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: drivers,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async driver(driverId: number) {
    const response: HttpResponse<RideShareDriver> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    const driver = await dataSources.rideShareDriverDAOService.findById(driverId, {
      attributes: { exclude: ["password", "loginToken"] },
      include: [Vehicle, { model: RideShareDriverSubscription, include: [Job] }, Contact, Transaction],
    });

    if (!driver) {
      response.result = driver;
      return Promise.resolve(response);
    }

    response.result = driver;
    return Promise.resolve(response);
  }

  @TryCatch
  public static async driverVehicles(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object<AppRequestParams>({
      driverId: Joi.string().required().label(DRIVER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    const driver = await dataSources.rideShareDriverDAOService.findById(+value?.driverId);

    if (!driver) {
      return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
    }

    const vehicles = await driver.$get("vehicles");

    const response: HttpResponse<Vehicle> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: vehicles,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async driverAppointments(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      driverId: Joi.string().required().label(DRIVER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    const driver = await dataSources.rideShareDriverDAOService.findById(+value.driverId);

    if (!driver) {
      return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
    }

    const appointments = await driver.$get("appointments", {
      include: [
        { model: Vehicle },
        { model: VehicleFault },
        {
          model: RideShareDriver,
          attributes: { exclude: ["password", "rawPassword", "loginToken"] },
        },
      ],
    });

    const response: HttpResponse<Appointment> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: appointments,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async driverTransactions(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object({
      driverId: Joi.string().required().label(DRIVER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.NOT_FOUND.code));
    }

    const driver = await dataSources.rideShareDriverDAOService.findById(+value.driverId);

    if (!driver) {
      return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));
    }

    const transactions = await driver.$get("transactions");

    const response: HttpResponse<Transaction> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: transactions,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public static async deleteDriver(req: Request) {
    const driverId = req.params.driverId as unknown as string;

    const driver = await dataSources.rideShareDriverDAOService.findById(+driverId);

    if (!driver)
      return Promise.reject(
        CustomAPIError.response(`Driver with Id ${driverId} does not exist.`, HttpStatus.NOT_FOUND.code)
      );

    await driver.destroy();

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: "Driver deleted successfully.",
    } as HttpResponse<void>);
  }
}
