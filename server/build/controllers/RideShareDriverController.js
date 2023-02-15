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
const joi_1 = __importDefault(require("joi"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const RideShareDriver_1 = __importDefault(require("../models/RideShareDriver"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const dao_1 = __importDefault(require("../services/dao"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const VehicleFault_1 = __importDefault(require("../models/VehicleFault"));
const RideShareDriverSubscription_1 = __importDefault(require("../models/RideShareDriverSubscription"));
const Job_1 = __importDefault(require("../models/Job"));
const Contact_1 = __importDefault(require("../models/Contact"));
const decorators_1 = require("../decorators");
const DRIVER_ID = 'Driver Id';
class RideShareDriverController {
    static async allRideShareDrivers() {
        const drivers = await dao_1.default.rideShareDriverDAOService.findAll({
            attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: drivers,
        };
        return Promise.resolve(response);
    }
    static async driver(driverId) {
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        const driver = await dao_1.default.rideShareDriverDAOService.findById(driverId, {
            attributes: { exclude: ['password', 'loginToken'] },
            include: [Vehicle_1.default, { model: RideShareDriverSubscription_1.default, include: [Job_1.default] }, Contact_1.default, Transaction_1.default],
        });
        if (!driver) {
            response.result = driver;
            return Promise.resolve(response);
        }
        response.result = driver;
        return Promise.resolve(response);
    }
    static async driverVehicles(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            driverId: joi_1.default.string().required().label(DRIVER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const driver = await dao_1.default.rideShareDriverDAOService.findById(+value?.driverId);
        if (!driver) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const vehicles = await driver.$get('vehicles');
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: vehicles,
        };
        return Promise.resolve(response);
    }
    static async driverAppointments(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            driverId: joi_1.default.string().required().label(DRIVER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const driver = await dao_1.default.rideShareDriverDAOService.findById(+value.driverId);
        if (!driver) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const appointments = await driver.$get('appointments', {
            include: [
                { model: Vehicle_1.default },
                { model: VehicleFault_1.default },
                {
                    model: RideShareDriver_1.default,
                    attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
                },
            ],
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: appointments,
        };
        return Promise.resolve(response);
    }
    static async driverTransactions(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            driverId: joi_1.default.string().required().label(DRIVER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const driver = await dao_1.default.rideShareDriverDAOService.findById(+value.driverId);
        if (!driver) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const transactions = await driver.$get('transactions');
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: transactions,
        };
        return Promise.resolve(response);
    }
    static async deleteDriver(req) {
        const driverId = req.params.driverId;
        const driver = await dao_1.default.rideShareDriverDAOService.findById(+driverId);
        if (!driver)
            return Promise.reject(CustomAPIError_1.default.response(`Driver with Id ${driverId} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
        await driver.destroy();
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: 'Driver deleted successfully.',
        });
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "allRideShareDrivers", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "driver", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "driverVehicles", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "driverAppointments", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "driverTransactions", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideShareDriverController, "deleteDriver", null);
exports.default = RideShareDriverController;
