import CrudRepository from "../helpers/CrudRepository";
import Technician from "../models/Technician";

export default class TechnicianRepository extends CrudRepository<
  Technician,
  number
> {
  constructor() {
    super(Technician);
  }
}
