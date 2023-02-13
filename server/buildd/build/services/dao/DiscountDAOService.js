"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscountDAOService {
    discountRepository;
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    create(values, options) {
        return this.discountRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.discountRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.discountRepository.findAll(options);
    }
    findByAny(options) {
        return this.discountRepository.findOne(options);
    }
    findById(id, options) {
        return this.discountRepository.findById(id, options);
    }
    update(discount, values, options) {
        return this.discountRepository.updateOne(discount, values, options);
    }
}
exports.default = DiscountDAOService;
