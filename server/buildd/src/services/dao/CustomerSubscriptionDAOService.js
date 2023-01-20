"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerSubscriptionDAOService {
    customerSubscriptionRepository;
    constructor(customerSubscriptionRepository) {
        this.customerSubscriptionRepository = customerSubscriptionRepository;
    }
    create(values, options) {
        return this.customerSubscriptionRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.customerSubscriptionRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.customerSubscriptionRepository.findAll(options);
    }
    findByAny(options) {
        return this.customerSubscriptionRepository.findOne(options);
    }
    findById(id, options) {
        return this.customerSubscriptionRepository.findById(id, options);
    }
    update(customerSubscription, values, options) {
        return this.customerSubscriptionRepository.updateOne(customerSubscription, values, options);
    }
}
exports.default = CustomerSubscriptionDAOService;
