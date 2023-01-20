"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerWorkShopDAOService {
    customerWorkShopRepository;
    constructor(customerWorkShopRepository) {
        this.customerWorkShopRepository = customerWorkShopRepository;
    }
    create(values, options) {
        return this.customerWorkShopRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.customerWorkShopRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.customerWorkShopRepository.findAll(options);
    }
    findByAny(options) {
        return this.customerWorkShopRepository.findOne(options);
    }
    findById(id, options) {
        return this.customerWorkShopRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.customerWorkShopRepository.updateOne(appointment, values, options);
    }
}
exports.default = CustomerWorkShopDAOService;
