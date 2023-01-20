"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
class TransactionDAOService {
    transactionRepository;
    constructor(transactionRepository) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.transactionRepository = transactionRepository;
    }
    create(values, options) {
        return this.transactionRepository.save(values, options);
    }
    update(transaction, values, options) {
        return this.transactionRepository.updateOne(transaction, values, options);
    }
    findById(id, options) {
        return this.transactionRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.transactionRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.transactionRepository.findOne(options);
    }
    findAll(options) {
        return this.transactionRepository.findAll(options);
    }
    async getTotalDailyTransactions() {
        return Generic_1.default.getDailyData(this.transactionRepository);
    }
    async getTotalMonthlyTransactions() {
        return Generic_1.default.getMonthlyData(this.transactionRepository);
    }
}
exports.default = TransactionDAOService;
