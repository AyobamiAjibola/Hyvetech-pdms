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
const Customer_1 = __importDefault(require("../models/Customer"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const dao_1 = __importDefault(require("../services/dao"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const VehicleFault_1 = __importDefault(require("../models/VehicleFault"));
const sequelize_1 = require("sequelize");
const decorators_1 = require("../decorators");
const CUSTOMER_ID = 'Customer Id';
class CustomerController {
    static async allCustomers() {
        const customers = await dao_1.default.customerDAOService.findAll({
            attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
            where: {
                [sequelize_1.Op.not]: { firstName: 'Anonymous' },
            },
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: customers,
        };
        return Promise.resolve(response);
    }
    static async customer(customerId) {
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        const customer = await dao_1.default.customerDAOService.findById(customerId, {
            attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
            include: [{ all: true }],
        });
        if (!customer) {
            response.result = customer;
            return Promise.resolve(response);
        }
        response.result = customer;
        return Promise.resolve(response);
    }
    static async customerVehicles(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            customerId: joi_1.default.string().required().label(CUSTOMER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const customer = await dao_1.default.customerDAOService.findById(+value?.customerId);
        if (!customer) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const vehicles = await customer.$get('vehicles');
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: vehicles,
        };
        return Promise.resolve(response);
    }
    static async customerAppointments(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            customerId: joi_1.default.string().required().label(CUSTOMER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const customer = await dao_1.default.customerDAOService.findById(+value.customerId);
        if (!customer) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const appointments = await customer.$get('appointments', {
            include: [
                { model: Vehicle_1.default },
                { model: VehicleFault_1.default },
                {
                    model: Customer_1.default,
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
    static async customerTransactions(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            customerId: joi_1.default.string().required().label(CUSTOMER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        const customer = await dao_1.default.customerDAOService.findById(+value.customerId);
        if (!customer) {
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        }
        const transactions = await customer.$get('transactions');
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: transactions,
        };
        return Promise.resolve(response);
    }
    static async suggestWorkshop(req) {
        const { error, value } = joi_1.default.object({
            name: joi_1.default.string().required().label('Name of workshop'),
            phone: joi_1.default.string().required().label('Contact phone number'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        const customerId = req.params.customerId;
        const customer = await dao_1.default.customerDAOService.findById(+customerId);
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
        const findByName = await dao_1.default.customerWorkShopDAOService.findByAny({
            where: { name: value.name },
        });
        if (findByName)
            return Promise.reject(CustomAPIError_1.default.response(`${value.name} has already been suggested`, HttpStatus_1.default.BAD_REQUEST.code));
        const workShop = await dao_1.default.customerWorkShopDAOService.create(value);
        await customer.$add('workshops', [workShop]);
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: `Thank you! We will take it from here :)`,
        });
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerController, "allCustomers", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController, "customer", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "customerVehicles", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "customerAppointments", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "customerTransactions", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "suggestWorkshop", null);
exports.default = CustomerController;
