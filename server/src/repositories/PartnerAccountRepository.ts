import CrudRepository from '../helpers/CrudRepository';
import PartnerAccount from '../models/PartnerAccount';

export default class PartAccountRepository extends CrudRepository<PartnerAccount, number> {
  constructor() {
    super(PartnerAccount);
  }
}
