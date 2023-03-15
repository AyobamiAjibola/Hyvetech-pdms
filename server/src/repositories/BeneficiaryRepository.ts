import CrudRepository from '../helpers/CrudRepository';
import Beneficiary from '../models/Beneficiary';

export default class BeneficiaryRepository extends CrudRepository<Beneficiary, number> {
  constructor() {
    super(Beneficiary);
  }
}
