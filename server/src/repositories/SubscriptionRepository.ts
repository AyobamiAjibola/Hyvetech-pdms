import CrudRepository from "../helpers/CrudRepository";
import Subscription from "../models/Subscription";

export default class SubscriptionRepository extends CrudRepository<Subscription, number> {
  constructor() {
    super(Subscription);
  }
}
