import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import { appCommonTypes } from "../@types/app-common";
import RideShareDriver from "../models/RideShareDriver";
import Vehicle from "../models/Vehicle";
import RideShareDriverSubscription from "../models/RideShareDriverSubscription";
import Contact from "../models/Contact";
import Transaction from "../models/Transaction";
import HttpResponse = appCommonTypes.HttpResponse;

export default class RideShareController {
  public async driver(id: number) {
    try {
      const driver = await dataSources.rideShareDriverDAOService.findById(id, {
        attributes: { exclude: ["password", "loginToken"] },
        include: [Vehicle, RideShareDriverSubscription, Contact, Transaction],
      });

      if (!driver)
        return Promise.reject(
          CustomAPIError.response(`Driver not found`, HttpStatus.NOT_FOUND.code)
        );

      const response: HttpResponse<RideShareDriver> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: driver,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
