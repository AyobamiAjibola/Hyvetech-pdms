"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobDAOService {
    jobRepository;
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    create(values, options) {
        return this.jobRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.jobRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.jobRepository.findAll(options);
    }
    findByAny(options) {
        return this.jobRepository.findOne(options);
    }
    findById(id, options) {
        return this.jobRepository.findById(id, options);
    }
    update(job, values, options) {
        return this.jobRepository.updateOne(job, values, options);
    }
}
exports.default = JobDAOService;
