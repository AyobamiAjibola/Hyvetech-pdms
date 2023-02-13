"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TagDAOService {
    tagRepository;
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    create(values, options) {
        return this.tagRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.tagRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.tagRepository.findAll(options);
    }
    findByAny(options) {
        return this.tagRepository.findOne(options);
    }
    findById(id, options) {
        return this.tagRepository.findById(id, options);
    }
    update(tag, values, options) {
        return this.tagRepository.updateOne(tag, values, options);
    }
}
exports.default = TagDAOService;
