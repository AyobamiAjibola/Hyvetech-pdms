"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VINDAOService {
    vinRepository;
    constructor(vinRepository) {
        this.vinRepository = vinRepository;
    }
    create(values, options) {
        return this.vinRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.vinRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.vinRepository.findAll(options);
    }
    findByAny(options) {
        return this.vinRepository.findOne(options);
    }
    findById(id, options) {
        return this.vinRepository.findById(id, options);
    }
    update(vin, values, options) {
        return this.vinRepository.updateOne(vin, values, options);
    }
}
exports.default = VINDAOService;
