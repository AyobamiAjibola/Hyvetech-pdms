"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckListDAOService {
    checklistRepository;
    constructor(checklistRepository) {
        this.checklistRepository = checklistRepository;
    }
    create(values, options) {
        return this.checklistRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.checklistRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.checklistRepository.findAll(options);
    }
    findByAny(options) {
        return this.checklistRepository.findOne(options);
    }
    findById(id, options) {
        return this.checklistRepository.findById(id, options);
    }
    update(checklist, values, options) {
        return this.checklistRepository.updateOne(checklist, values, options);
    }
}
exports.default = CheckListDAOService;
