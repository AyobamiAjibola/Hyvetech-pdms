"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentGatewayDAOService {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    create(values, options) {
        return this.paymentGateway.save(values, options);
    }
    deleteById(id, options) {
        return this.paymentGateway.deleteById(id, options);
    }
    findAll(options) {
        return this.paymentGateway.findAll(options);
    }
    findByAny(options) {
        return this.paymentGateway.findOne(options);
    }
    findById(id, options) {
        return this.paymentGateway.findById(id, options);
    }
    update(paymentGateway, values, options) {
        return this.paymentGateway.updateOne(paymentGateway, values, options);
    }
}
exports.default = PaymentGatewayDAOService;
