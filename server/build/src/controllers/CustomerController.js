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
const Contact_1 = __importDefault(require("../models/Contact"));
const settings_1 = __importDefault(require("../config/settings"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const rabbitmq_email_manager_1 = __importDefault(require("rabbitmq-email-manager"));
const constants_1 = require("../config/constants");
const main_welcome_corporate_email_1 = __importDefault(require("../resources/templates/email/main_welcome_corporate_email"));
const main_welcome_individual_email_1 = __importDefault(require("../resources/templates/email/main_welcome_individual_email"));
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
    static async allNewCustomers(req) {
        // console.log(req)
        // so let's process some information
        // check if requester is a user admin
        let customers;
        if (req?.user?.id == 1) {
            // user is admin
            customers = await dao_1.default.customerDAOService.findAll({
                attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
                where: {
                    [sequelize_1.Op.not]: { firstName: 'Anonymous' },
                },
            });
        }
        else {
            // user created by workshop
            customers = await dao_1.default.customerDAOService.findAll({
                attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
                where: {
                    [sequelize_1.Op.not]: { firstName: 'Anonymous' },
                    partnerId: req?.user?.partner.id
                },
                include: [Contact_1.default]
            });
        }
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: customers.reverse(),
        };
        return Promise.resolve(response);
    }
    static async addCustomers(req) {
        // console.log(req.body)
        const { error, value } = joi_1.default.object({
            firstName: joi_1.default.string().required().label("First Name"),
            lastName: joi_1.default.string().required().label("Last Name"),
            email: joi_1.default.string().email().required().label("Email"),
            state: joi_1.default.string().required().label("State"),
            district: joi_1.default.string().required().label("District"),
            phone: joi_1.default.string().required().label("Phone"),
            address: joi_1.default.string().optional().label("Address"),
            creditRating: joi_1.default.string().optional().label("Credit Rating"),
            companyName: joi_1.default.any().allow().label("Company Name"),
            accountType: joi_1.default.string().optional().label("Account Type"),
        }).validate(req.body);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        value.email = (value.email).toLowerCase();
        // check if user exist
        const customer = await dao_1.default.customerDAOService.findByAny({
            where: {
                [sequelize_1.Op.or]: [{ email: (value.email).toLowerCase() }, { phone: value.phone }],
            },
        });
        if (customer) {
            return Promise.reject(CustomAPIError_1.default.response("Customer already exist", HttpStatus_1.default.NOT_FOUND.code));
        }
        //find role by name
        const role = await dao_1.default.roleDAOService.findByAny({
            where: { slug: settings_1.default.roles[1] },
        });
        // const state = await dataSources.stateDAOService.findByAny({
        //   where: { alias: value.state },
        // });
        // if (!state)
        //   return Promise.reject(CustomAPIError.response(`State ${value.state} does not exist`, HttpStatus.NOT_FOUND.code));
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response(`Role ${settings_1.default.roles[1]} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const passwordEncoder = new PasswordEncoder_1.default();
        const payload = {
            rawPassword: value.phone,
            password: (await passwordEncoder.encode(value.phone)),
            enabled: true,
            active: true,
            companyName: value.companyName,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            phone: value.phone,
            partnerId: req?.user.partner?.id || null
        };
        const contactValues = {
            label: 'Home',
            state: value.state,
            district: value.district,
            address: value.address
        };
        const contact = await dao_1.default.contactDAOService.create(contactValues);
        // @ts-ignore
        const user = await dao_1.default.customerDAOService.create(payload);
        //associate user with role
        await user.$set('roles', [role]);
        await user.$set('contacts', [contact]);
        // send mail
        let welcomeHtml;
        const fullName = `${value.firstName} ${value.lastName}`;
        if (value.companyName)
            welcomeHtml = (0, main_welcome_corporate_email_1.default)(fullName);
        else
            welcomeHtml = (0, main_welcome_individual_email_1.default)(fullName);
        // const passwordHtml = main_default_password_email(value.rawPassword);
        const queuePayload = {
            queue: constants_1.QUEUE_EVENTS.name,
            data: {
                to: user.email,
                from: {
                    name: process.env.SMTP_EMAIL_FROM_NAME,
                    address: process.env.SMTP_EMAIL_FROM,
                },
                subject: `Welcome to AutoHyve`,
                html: welcomeHtml,
                bcc: [process.env.SMTP_BCC, process.env.SMTP_CONFIG_USERNAME],
            },
        };
        await rabbitmq_email_manager_1.default.publish(queuePayload);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value
        };
        return Promise.resolve(response);
    }
    static async updateCustomers(req) {
        console.log(req.body);
        const { error, value } = joi_1.default.object({
            id: joi_1.default.any().required().label("Customer Id"),
            firstName: joi_1.default.string().optional().label("First Name"),
            lastName: joi_1.default.string().optional().label("Last Name"),
            phone: joi_1.default.string().optional().label("Phone"),
            creditRating: joi_1.default.any().optional().label("Credit Rating"),
            state: joi_1.default.string().optional().label("State"),
            district: joi_1.default.string().optional().label("District"),
        }).validate(req.body);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        // check if user exist
        const customer = await dao_1.default.customerDAOService.findById(value.id);
        if (!customer) {
            return Promise.reject(CustomAPIError_1.default.response("Customer not found", HttpStatus_1.default.NOT_FOUND.code));
        }
        customer.phone = value.phone;
        customer.firstName = value.firstName;
        customer.lastName = value.lastName;
        customer.creditRating = value.creditRating;
        await customer.save();
        await Contact_1.default.update({
            district: value.district,
            state: value.state,
        }, {
            where: {
                // @ts-ignore
                customerId: value.id
            }
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value
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
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "allNewCustomers", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "addCustomers", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController, "updateCustomers", null);
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
