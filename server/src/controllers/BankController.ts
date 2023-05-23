import { Request } from 'express';
import { TryCatch } from '../decorators';
import CBAService from '../services/CBAService';
import * as appModels from '../services/BankService';
import { appCommonTypes } from '../@types/app-common';
import HttpResponse = appCommonTypes.HttpResponse;
import HttpStatus from '../helpers/HttpStatus';

export default class BankController {
  private readonly cbaService: CBAService;
  constructor(cbaService: CBAService) {
    this.cbaService = cbaService;
  }
  @TryCatch
  public async getBanks(req: Request) {
    const banks = await this.doGetBanks(req);

    const response: HttpResponse<appModels.Bank[]> = {
      code: HttpStatus.OK.code,
      message: 'Banks retrived successfully.',
      result: banks,
    };

    return Promise.resolve(response);
  }

  private doGetBanks(req: Request) {
    return this.cbaService.getBanks();
  }
}
