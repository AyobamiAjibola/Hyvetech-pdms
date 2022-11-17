import CrudRepository from '../helpers/CrudRepository';
import Plan from '../models/Plan';

export default class PlanRepository extends CrudRepository<Plan, number> {
  constructor() {
    super(Plan);
  }
}
