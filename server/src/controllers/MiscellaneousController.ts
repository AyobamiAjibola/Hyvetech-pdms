import dataSources from '../services/dao';
import District from '../models/District';
import HttpStatus from '../helpers/HttpStatus';
import { appCommonTypes } from '../@types/app-common';
import State from '../models/State';
import { TryCatch } from '../decorators';
import { Request } from 'express';
import dataStore from '../config/dataStore';
import { PAY_STACK_BANKS } from '../config/constants';
import { appModelTypes } from '../@types/app-model';
import HttpResponse = appCommonTypes.HttpResponse;
import IPayStackBank = appModelTypes.IPayStackBank;

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
    const banks = await dataStore.get(PAY_STACK_BANKS);

    if (banks) {
      return Promise.resolve({
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: JSON.parse(banks),
      } as HttpResponse<IPayStackBank>);
    }

    return Promise.resolve({
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: [],
    } as HttpResponse<IPayStackBank>);
  }
}
