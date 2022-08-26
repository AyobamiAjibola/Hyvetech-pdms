import CrudRepository from "../helpers/CrudRepository";
import PaymentPlan from "../models/PaymentPlan";

export default class PaymentPlanRepository extends CrudRepository<
  PaymentPlan,
  number
> {
  constructor() {
    super(PaymentPlan);
  }
}
