import CrudRepository from '../helpers/CrudRepository';
import Partner from '../models/Partner';

export default class PartnerRepository extends CrudRepository<Partner, number> {
  constructor() {
    super(Partner);
  }
}
