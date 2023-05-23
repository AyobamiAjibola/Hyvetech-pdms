import BankService, * as appModelTypes from './BankService';
import AccountDTO = appModelTypes.AccountDTO;

class CBAService {
  private readonly bankService: BankService;
  constructor(service: BankService) {
    this.bankService = service;
  }
  getMainAccountBalance() {
    return this.bankService.getMainAccountBalance();
  }

  perFormNameEnquiry(payload: appModelTypes.ConfirmRecipientDTO) {
    return this.bankService.performNameEnquiry(payload);
  }

  getBanks() {
    return this.bankService.getBanks();
  }
}

export default CBAService;
