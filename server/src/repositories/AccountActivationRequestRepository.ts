import CrudRepository from '../helpers/CrudRepository';
import AccountActivationRequest from '../models/AccountActivationRequest';
import PartnerAccount from '../models/PartnerAccount';

export default class AccountActivationRequestRepository extends CrudRepository<AccountActivationRequest, number> {
  constructor() {
    super(AccountActivationRequest);
  }
}
