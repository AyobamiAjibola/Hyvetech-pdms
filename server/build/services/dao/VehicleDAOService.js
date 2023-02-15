"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
class VehicleDAOService {
    constructor(vehicleRepository) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.vehicleRepository = vehicleRepository;
    }
    create(values, options) {
        return this.vehicleRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.vehicleRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.vehicleRepository.findAll(options);
    }
    findByAny(options) {
        return this.vehicleRepository.findOne(options);
    }
    findById(id, options) {
        return this.vehicleRepository.findById(id, options);
    }
    update(vehicle, values, options) {
        return this.vehicleRepository.updateOne(vehicle, values, options);
    }
    async getTotalDailyVehicles() {
        return Generic_1.default.getDailyData(this.vehicleRepository);
    }
    async getTotalMonthlyVehicles() {
        return Generic_1.default.getMonthlyData(this.vehicleRepository);
    }
    findByPlateNumber(plateNumber, options) {
        return this.vehicleRepository.findOne({ where: { plateNumber }, ...options });
    }
    findByVIN(vin, options) {
        return this.vehicleRepository.findOne({ where: { vin }, ...options });
    }
}
exports.default = VehicleDAOService;
