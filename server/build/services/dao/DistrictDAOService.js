"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DistrictDAOService {
    districtRepository;
    constructor(districtRepository) {
        this.districtRepository = districtRepository;
    }
    create(values, options) {
        return this.districtRepository.save(values, options);
    }
    update(district, values, options) {
        return this.districtRepository.updateOne(district, values, options);
    }
    findById(id, options) {
        return this.districtRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.districtRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.districtRepository.findOne(options);
    }
    findAll(options) {
        return this.districtRepository.findAll(options);
    }
}
exports.default = DistrictDAOService;
