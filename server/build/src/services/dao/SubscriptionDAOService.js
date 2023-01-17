"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionDAOService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    create(values, options) {
        return this.subscriptionRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.subscriptionRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.subscriptionRepository.findAll(options);
    }
    findByAny(options) {
        return this.subscriptionRepository.findOne(options);
    }
    findById(id, options) {
        return this.subscriptionRepository.findById(id, options);
    }
    update(subscription, values, options) {
        return this.subscriptionRepository.updateOne(subscription, values, options);
    }
}
exports.default = SubscriptionDAOService;
