import CrudRepository from "../helpers/CrudRepository";
import Estimate from "../models/Estimate";

export default class EstimateRepository extends CrudRepository<Estimate, number> {
  constructor() {
    super(Estimate);
  }
}
