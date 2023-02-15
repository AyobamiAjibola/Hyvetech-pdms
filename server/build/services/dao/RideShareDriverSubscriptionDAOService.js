"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RideShareDriverSubscriptionDAOService {
    rideShareDriverSubscription;
    constructor(rideShareDriverSubscription) {
        this.rideShareDriverSubscription = rideShareDriverSubscription;
    }
    create(values, options) {
        return this.rideShareDriverSubscription.save(values, options);
    }
    update(district, values, options) {
        return this.rideShareDriverSubscription.updateOne(district, values, options);
    }
    findById(id, options) {
        return this.rideShareDriverSubscription.findById(id, options);
    }
    deleteById(id, options) {
        return this.rideShareDriverSubscription.deleteById(id, options);
    }
    findByAny(options) {
        return this.rideShareDriverSubscription.findOne(options);
    }
    findAll(options) {
        return this.rideShareDriverSubscription.findAll(options);
    }
}
exports.default = RideShareDriverSubscriptionDAOService;
