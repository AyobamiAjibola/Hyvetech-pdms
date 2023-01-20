"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlanDAOService {
    planRepository;
    constructor(planRepository) {
        this.planRepository = planRepository;
    }
    create(values, options) {
        return this.planRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.planRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.planRepository.findAll(options);
    }
    findByAny(options) {
        return this.planRepository.findOne(options);
    }
    findByName(name, options) {
        return this.planRepository.findOne({
            where: { label: name },
            ...options,
        });
    }
    findById(id, options) {
        return this.planRepository.findById(id, options);
    }
    update(plan, values, options) {
        return this.planRepository.updateOne(plan, values, options);
    }
}
exports.default = PlanDAOService;
