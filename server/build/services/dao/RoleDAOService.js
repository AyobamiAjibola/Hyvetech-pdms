"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleDAOService {
    roleRepository;
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    create(values, options) {
        return this.roleRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.roleRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.roleRepository.findAll(options);
    }
    findByAny(options) {
        return this.roleRepository.findOne(options);
    }
    findById(id, options) {
        return this.roleRepository.findById(id, options);
    }
    update(role, values, options) {
        return this.roleRepository.updateOne(role, values, options);
    }
}
exports.default = RoleDAOService;
