import { Request } from "express";
import { appEventEmitter } from "../services/AppEventEmitter";
import { TXN_CANCELLED, TXN_REFERENCE } from "../config/constants";
import { appCommonTypes } from "../@types/app-common";
import HttpStatus from "../helpers/HttpStatus";
import HttpResponse = appCommonTypes.HttpResponse;

export default class TransactionController {
  public static async subscriptionsTransactionStatus(req: Request) {
    try {
      const query = req.query;

      if (query.status && query.status === "cancelled") {
        appEventEmitter.emit(TXN_CANCELLED, { cancelled: true });
      }

      if (query.reference) {
        appEventEmitter.emit(TXN_REFERENCE, { reference: query.reference });
      }

      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
      } as HttpResponse<any>);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
