"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeSlotDAOService {
    timeSlotRepository;
    constructor(timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }
    create(values, options) {
        return this.timeSlotRepository.save(values, options);
    }
    update(timeSlot, values, options) {
        return this.timeSlotRepository.updateOne(timeSlot, values, options);
    }
    findById(id, options) {
        return this.timeSlotRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.timeSlotRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.timeSlotRepository.findOne(options);
    }
    findAll(options) {
        return this.timeSlotRepository.findAll(options);
    }
}
exports.default = TimeSlotDAOService;
