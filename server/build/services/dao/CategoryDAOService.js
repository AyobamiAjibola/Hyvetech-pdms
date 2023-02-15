"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment/moment"));
class CategoryDAOService {
    categoryRepository;
    constructor(categoryRepository) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.categoryRepository = categoryRepository;
    }
    create(values, options) {
        return this.categoryRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.categoryRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.categoryRepository.findAll(options);
    }
    findByAny(options) {
        return this.categoryRepository.findOne(options);
    }
    findById(id, options) {
        return this.categoryRepository.findById(id, options);
    }
    update(category, values, options) {
        return this.categoryRepository.updateOne(category, values, options);
    }
}
exports.default = CategoryDAOService;
