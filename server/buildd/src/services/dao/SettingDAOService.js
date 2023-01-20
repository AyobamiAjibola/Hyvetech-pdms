"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SettingDAOService {
    settingRepository;
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    create(values, options) {
        return this.settingRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.settingRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.settingRepository.findAll(options);
    }
    findByAny(options) {
        return this.settingRepository.findOne(options);
    }
    findById(id, options) {
        return this.settingRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.settingRepository.updateOne(appointment, values, options);
    }
}
exports.default = SettingDAOService;
