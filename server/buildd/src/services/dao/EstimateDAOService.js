"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EstimateDAOService {
    estimateRepository;
    constructor(estimateRepository) {
        this.estimateRepository = estimateRepository;
    }
    create(values, options) {
        return this.estimateRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.estimateRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.estimateRepository.findAll(options);
    }
    findByAny(options) {
        return this.estimateRepository.findOne(options);
    }
    findById(id, options) {
        return this.estimateRepository.findById(id, options);
    }
    update(estimate, values, options) {
        return this.estimateRepository.updateOne(estimate, values, options);
    }
}
exports.default = EstimateDAOService;
