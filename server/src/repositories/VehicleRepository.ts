import CrudRepository from '../helpers/CrudRepository';
import Vehicle from '../models/Vehicle';

export default class VehicleRepository extends CrudRepository<Vehicle, number> {
  constructor() {
    super(Vehicle);
  }
}
