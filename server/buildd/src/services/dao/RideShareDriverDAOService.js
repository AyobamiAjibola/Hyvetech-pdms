"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RideShareDriverDAOService {
    rideShareDriverRepository;
    constructor(rideShareDriverRepository) {
        this.rideShareDriverRepository = rideShareDriverRepository;
    }
    create(values, options) {
        return this.rideShareDriverRepository.save(values, options);
    }
    update(district, values, options) {
        return this.rideShareDriverRepository.updateOne(district, values, options);
    }
    findById(id, options) {
        return this.rideShareDriverRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.rideShareDriverRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.rideShareDriverRepository.findOne(options);
    }
    findAll(options) {
        return this.rideShareDriverRepository.findAll(options);
    }
}
exports.default = RideShareDriverDAOService;
