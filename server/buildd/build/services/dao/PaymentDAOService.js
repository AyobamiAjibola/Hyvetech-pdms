"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentTermDAOService {
    paymentTerm;
    constructor(paymentTerm) {
        this.paymentTerm = paymentTerm;
    }
    create(values, options) {
        return this.paymentTerm.save(values, options);
    }
    deleteById(id, options) {
        return this.paymentTerm.deleteById(id, options);
    }
    findAll(options) {
        return this.paymentTerm.findAll(options);
    }
    findByAny(options) {
        return this.paymentTerm.findOne(options);
    }
    findById(id, options) {
        return this.paymentTerm.findById(id, options);
    }
    update(paymentTerm, values, options) {
        return this.paymentTerm.updateOne(paymentTerm, values, options);
    }
}
exports.default = PaymentTermDAOService;
