"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VehicleFaultDAOService {
    carFaultRepository;
    constructor(carFaultRepository) {
        this.carFaultRepository = carFaultRepository;
    }
    create(values, options) {
        return this.carFaultRepository.save(values, options);
    }
    update(vehicleFault, values, options) {
        return this.carFaultRepository.updateOne(vehicleFault, values, options);
    }
    findById(id, options) {
        return this.carFaultRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.carFaultRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.carFaultRepository.findOne(options);
    }
    findAll(options) {
        return this.carFaultRepository.findAll(options);
    }
}
exports.default = VehicleFaultDAOService;
