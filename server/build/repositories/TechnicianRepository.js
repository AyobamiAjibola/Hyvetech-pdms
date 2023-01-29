"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
const Technician_1 = __importDefault(require("../models/Technician"));
class TechnicianRepository extends CrudRepository_1.default {
    constructor() {
        super(Technician_1.default);
    }
}
exports.default = TechnicianRepository;
