import dataSources from '../services/dao';
import District from '../models/District';
import HttpStatus from '../helpers/HttpStatus';
import { appCommonTypes } from '../@types/app-common';
import State from '../models/State';
import { TryCatch } from '../decorators';
import { Request } from 'express';
import { appModelTypes } from '../@types/app-model';
import Bank from '../models/Bank';
import HttpResponse = appCommonTypes.HttpResponse;

export default class MiscellaneousController {
  public static async getStatesAndDistricts() {
    try {
      const states = await dataSources.stateDAOService.findAll({
        include: [{ model: District }],
      });

      const response: HttpResponse<State> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: states,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @TryCatch
  public static async getPayStackBanks(req: Request) {
    const banks = await dataSources.bankDAOService.findAll();

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: banks,
    } as HttpResponse<Bank>);
  }
}
