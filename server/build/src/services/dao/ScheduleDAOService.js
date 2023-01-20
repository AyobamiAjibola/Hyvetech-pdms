"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScheduleDAOService {
    scheduleRepository;
    constructor(scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }
    create(values, options) {
        return this.scheduleRepository.save(values, options);
    }
    update(schedule, values, options) {
        return this.scheduleRepository.updateOne(schedule, values, options);
    }
    findById(id, options) {
        return this.scheduleRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.scheduleRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.scheduleRepository.findOne(options);
    }
    findAll(options) {
        return this.scheduleRepository.findAll(options);
    }
}
exports.default = ScheduleDAOService;
