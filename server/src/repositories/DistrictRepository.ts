import CrudRepository from '../helpers/CrudRepository';
import District from '../models/District';

export default class DistrictRepository extends CrudRepository<District, number> {
  constructor() {
    super(District);
  }
}
