"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
class AppointmentDAOService {
    appointmentRepository;
    constructor(appointmentRepository) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.appointmentRepository = appointmentRepository;
    }
    create(values, options) {
        return this.appointmentRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.appointmentRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.appointmentRepository.findAll(options);
    }
    findByAny(options) {
        return this.appointmentRepository.findOne(options);
    }
    findById(id, options) {
        return this.appointmentRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.appointmentRepository.updateOne(appointment, values, options);
    }
    async getTotalDailyAppointments() {
        return Generic_1.default.getDailyData(this.appointmentRepository);
    }
    async getTotalMonthlyAppointments() {
        return Generic_1.default.getMonthlyData(this.appointmentRepository);
    }
}
exports.default = AppointmentDAOService;
