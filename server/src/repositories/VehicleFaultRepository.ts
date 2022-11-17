import CrudRepository from "../helpers/CrudRepository";
import VehicleFault from "../models/VehicleFault";

export default class VehicleFaultRepository extends CrudRepository<VehicleFault, number> {
  constructor() {
    super(VehicleFault);
  }
}
