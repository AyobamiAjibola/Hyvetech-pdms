"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = __importDefault(require("../services/dao"));
const District_1 = __importDefault(require("../models/District"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const decorators_1 = require("../decorators");
class MiscellaneousController {
    static async getStatesAndDistricts() {
        try {
            const states = await dao_1.default.stateDAOService.findAll({
                include: [{ model: District_1.default }],
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: states,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async getPayStackBanks(req) {
        const banks = await dao_1.default.bankDAOService.findAll();
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: banks,
        });
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MiscellaneousController, "getPayStackBanks", null);
exports.default = MiscellaneousController;
