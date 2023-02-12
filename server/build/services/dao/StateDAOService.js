"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StateDAOService {
    stateRepository;
    constructor(stateRepository) {
        this.stateRepository = stateRepository;
    }
    create(values, options) {
        return this.stateRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.stateRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.stateRepository.findAll(options);
    }
    findByAny(options) {
        return this.stateRepository.findOne(options);
    }
    findById(id, options) {
        return this.stateRepository.findById(id, options);
    }
    update(state, values, options) {
        return this.stateRepository.updateOne(state, values, options);
    }
}
exports.default = StateDAOService;
