"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
class PartnerDAOService {
    partnerRepository;
    constructor(partnerRepository) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.partnerRepository = partnerRepository;
    }
    deleteById(id, options) {
        return this.partnerRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.partnerRepository.findAll(options);
    }
    findByAny(options) {
        return this.partnerRepository.findOne(options);
    }
    findById(id, options) {
        return this.partnerRepository.findById(id, options);
    }
    update(partner, values, options) {
        return this.partnerRepository.updateOne(partner, values, options);
    }
    async getTotalDailyPartners() {
        return Generic_1.default.getDailyData(this.partnerRepository);
    }
    async getTotalMonthlyPartners() {
        return Generic_1.default.getMonthlyData(this.partnerRepository);
    }
    create(values, options) {
        return this.partnerRepository.save(values, options);
    }
}
exports.default = PartnerDAOService;
