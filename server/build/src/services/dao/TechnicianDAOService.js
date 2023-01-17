"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TechnicianDAOService {
    technicianRepository;
    constructor(technicianRepository) {
        this.technicianRepository = technicianRepository;
    }
    create(values, options) {
        return this.technicianRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.technicianRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.technicianRepository.findAll(options);
    }
    findByAny(options) {
        return this.technicianRepository.findOne(options);
    }
    findById(id, options) {
        return this.technicianRepository.findById(id, options);
    }
    update(technician, values, options) {
        return this.technicianRepository.updateOne(technician, values, options);
    }
}
exports.default = TechnicianDAOService;
