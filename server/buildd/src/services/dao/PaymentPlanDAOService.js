"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentPlanDAOService {
    paymentPlanRepository;
    constructor(paymentPlanRepository) {
        this.paymentPlanRepository = paymentPlanRepository;
    }
    bulkCreate(records, options) {
        return this.paymentPlanRepository.bulkCreate(records, options);
    }
    create(values, options) {
        return this.paymentPlanRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.paymentPlanRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.paymentPlanRepository.findAll(options);
    }
    findByAny(options) {
        return this.paymentPlanRepository.findOne(options);
    }
    findById(id, options) {
        return this.paymentPlanRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.paymentPlanRepository.updateOne(appointment, values, options);
    }
}
exports.default = PaymentPlanDAOService;
