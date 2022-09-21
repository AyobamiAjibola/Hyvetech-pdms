import CrudRepository from "../helpers/CrudRepository";
import RideShareDriver from "../models/RideShareDriver";

export default class RideShareDriverRepository extends CrudRepository<
  RideShareDriver,
  number
> {
  constructor() {
    super(RideShareDriver);
  }
}
