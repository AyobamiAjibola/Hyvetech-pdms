"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContactDAOService {
    contactRepository;
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    create(values, options) {
        return this.contactRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.contactRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.contactRepository.findAll(options);
    }
    findByAny(options) {
        return this.contactRepository.findOne(options);
    }
    findById(id, options) {
        return this.contactRepository.findById(id, options);
    }
    update(contact, values, options) {
        return this.contactRepository.updateOne(contact, values, options);
    }
}
exports.default = ContactDAOService;
