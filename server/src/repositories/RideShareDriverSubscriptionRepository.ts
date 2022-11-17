import CrudRepository from "../helpers/CrudRepository";
import RideShareDriverSubscription from "../models/RideShareDriverSubscription";

export default class RideShareDriverSubscriptionRepository extends CrudRepository<RideShareDriverSubscription, number> {
  constructor() {
    super(RideShareDriverSubscription);
  }
}
