import CrudRepository from "../helpers/CrudRepository";
import CustomerSubscription from "../models/CustomerSubscription";

export default class CustomerSubscriptionRepository extends CrudRepository<CustomerSubscription, number> {
  constructor() {
    super(CustomerSubscription);
  }
}
