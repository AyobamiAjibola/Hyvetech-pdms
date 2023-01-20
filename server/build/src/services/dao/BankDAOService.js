"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BankDAOService {
    bankRepository;
    constructor(bankRepository) {
        this.bankRepository = bankRepository;
    }
    create(values, options) {
        return this.bankRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.bankRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.bankRepository.findAll(options);
    }
    findByAny(options) {
        return this.bankRepository.findOne(options);
    }
    findById(id, options) {
        return this.bankRepository.findById(id, options);
    }
    update(bank, values, options) {
        return this.bankRepository.updateOne(bank, values, options);
    }
}
exports.default = BankDAOService;
