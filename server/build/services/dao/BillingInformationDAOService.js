"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BillingInformationDAOService {
    billingInformationRepository;
    constructor(billingInformationRepository) {
        this.billingInformationRepository = billingInformationRepository;
    }
    create(values, options) {
        return this.billingInformationRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.billingInformationRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.billingInformationRepository.findAll(options);
    }
    findByAny(options) {
        return this.billingInformationRepository.findOne(options);
    }
    findById(id, options) {
        return this.billingInformationRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.billingInformationRepository.updateOne(appointment, values, options);
    }
}
exports.default = BillingInformationDAOService;
