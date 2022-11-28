import CrudRepository from '../helpers/CrudRepository';
import BillingInformation from '../models/BillingInformation';

export default class BillingInformationRepository extends CrudRepository<BillingInformation, number> {
  constructor() {
    super(BillingInformation);
  }
}
