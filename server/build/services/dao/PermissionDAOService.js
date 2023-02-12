"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionDAOService {
    permissionRepository;
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    create(values, options) {
        return this.permissionRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.permissionRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.permissionRepository.findAll(options);
    }
    findByAny(options) {
        return this.permissionRepository.findOne(options);
    }
    findById(id, options) {
        return this.permissionRepository.findById(id, options);
    }
    update(permission, values, options) {
        return this.permissionRepository.updateOne(permission, values, options);
    }
}
exports.default = PermissionDAOService;
