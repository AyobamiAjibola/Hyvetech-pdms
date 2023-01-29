"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = __importDefault(require("../services/dao"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const Vehicle_1 = __importStar(require("../models/Vehicle"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Job_1 = __importDefault(require("../models/Job"));
const joi_1 = __importDefault(require("joi"));
class VehicleController {
    static async vehicleSubscriptions(req) {
        const vehicleId = req.params.vehicleId;
        const path = req.path;
        try {
            const vehicle = await dao_1.default.vehicleDAOService.findById(+vehicleId);
            if (!vehicle)
                return Promise.reject(CustomAPIError_1.default.response(`Vehicle with id: ${vehicleId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            let subscriptions = [];
            switch (path) {
                case path.match('customer-subs')?.input:
                    subscriptions = await dao_1.default.customerSubscriptionDAOService.findAll({
                        include: [{ model: Vehicle_1.default, where: { id: +vehicleId } }, Transaction_1.default, Job_1.default],
                    });
                    break;
                case path.match('driver-subs')?.input:
                    subscriptions = await dao_1.default.rideShareDriverSubscriptionDAOService.findAll({
                        include: [{ model: Vehicle_1.default, where: { id: +vehicleId } }, Transaction_1.default, Job_1.default],
                    });
                    break;
                default:
            }
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: subscriptions,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async getVIN(req) {
        const { error, value } = joi_1.default.object(Vehicle_1.$vinSchema).validate(req.query);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const vin = value.vin;
        try {
            const defaultProvider = await dao_1.default.vinDecoderProviderDAOService.findByAny({
                where: { default: true },
            });
            if (!defaultProvider) {
                return Promise.reject(CustomAPIError_1.default.response(`No default provider`, HttpStatus_1.default.NOT_FOUND.code));
            }
            //use the first provider to make the API request
            const vinData = await dao_1.default.vinDecoderProviderDAOService.decodeVIN(vin, defaultProvider);
            if (!vinData.length)
                return Promise.reject(CustomAPIError_1.default.response(`Could not find matching result for vin: ${vin}`, HttpStatus_1.default.NOT_FOUND.code));
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: vinData,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = VehicleController;
