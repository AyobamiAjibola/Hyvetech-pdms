import CrudRepository from "../helpers/CrudRepository";
import VIN from "../models/VIN";

export default class VINRepository extends CrudRepository<VIN, number> {
  constructor() {
    super(VIN);
  }
}
