import dataSources from "../services/dao";
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
    const response: HttpResponse<RideShareDriver> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
    };

    try {
      const driver = await dataSources.rideShareDriverDAOService.findById(id, {
        attributes: { exclude: ["password", "loginToken"] },
        include: [Vehicle, RideShareDriverSubscription, Contact, Transaction],
      });

      console.log(driver);

      if (!driver) {
        response.result = driver;
        return Promise.resolve(response);
      }

      response.result = driver;
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
