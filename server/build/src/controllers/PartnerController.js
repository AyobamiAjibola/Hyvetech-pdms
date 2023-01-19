"use strict";
// noinspection JSUnfilteredForInLoop
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
const joi_1 = __importDefault(require("joi"));
const capitalize_1 = __importDefault(require("capitalize"));
const sequelize_1 = require("sequelize");
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const constants_1 = require("../config/constants");
const Generic_1 = __importDefault(require("../utils/Generic"));
const settings_1 = __importDefault(require("../config/settings"));
const Partner_1 = __importDefault(require("../models/Partner"));
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
const Contact_1 = __importDefault(require("../models/Contact"));
const Plan_1 = __importStar(require("../models/Plan"));
const PaymentPlan_1 = require("../models/PaymentPlan");
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const lodash_1 = __importDefault(require("lodash"));
const JobController_1 = __importDefault(require("./JobController"));
const rabbitmq_email_manager_1 = require("rabbitmq-email-manager");
const formidable_1 = __importDefault(require("formidable"));
const garage_partner_welcome_email_1 = __importDefault(require("../resources/templates/email/garage_partner_welcome_email"));
const ride_share_partner_welcome_email_1 = __importDefault(require("../resources/templates/email/ride_share_partner_welcome_email"));
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
class PartnerController {
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    static formatPartners(partners) {
        return partners.map(partner => this.formatPartner(partner));
    }
    static formatPartner(partner) {
        const workingHours = partner.workingHours;
        const brands = partner.brands;
        if (workingHours || brands) {
            Object.assign(partner, {
                workingHours: workingHours.map(workingHour => JSON.parse(workingHour)),
                brands: brands.map(brand => JSON.parse(brand)),
            });
        }
        return partner;
    }
    /**
     * @name createPartner
     * @description Create partners
     * @param req
     */
    async createPartner(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                try {
                    const { error, value } = joi_1.default.object({
                        name: joi_1.default.string().required().label('Name'),
                        email: joi_1.default.string().email().required().label('Email'),
                        category: joi_1.default.string().required().label('Category'),
                        state: joi_1.default.string().required().label('State'),
                        phone: joi_1.default.string().max(11).required().label('Phone Number'),
                    }).validate(fields);
                    if (error)
                        return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                    //check if partner with email or name already exist
                    const _partner = await dao_1.default.partnerDAOService.findByAny({
                        where: { name: value.name },
                    });
                    if (_partner)
                        return reject(CustomAPIError_1.default.response(`Partner with name already exist`, HttpStatus_1.default.BAD_REQUEST.code));
                    const state = await dao_1.default.stateDAOService.findByAny({
                        where: {
                            alias: value.state,
                        },
                    });
                    if (!state)
                        return reject(CustomAPIError_1.default.response(`State does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const password = process.env.PARTNER_PASS;
                    const partnerValues = {
                        email: value.email,
                        name: value.name,
                        phone: value.phone,
                        slug: Generic_1.default.generateSlug(value.name),
                        totalStaff: 0,
                        totalTechnicians: 0,
                        yearOfIncorporation: 0,
                    };
                    const userValues = {
                        username: value.email,
                        email: value.email,
                        firstName: 'Admin',
                        lastName: 'Admin',
                        // active: true,
                        active: false,
                        password,
                        rawPassword: password,
                    };
                    const contactValues = {
                        state: state.name,
                        country: 'Nigeria',
                    };
                    let category, role, mailSubject, mailText;
                    //Garage Partner
                    if (value.category === constants_1.CATEGORIES[3].name) {
                        mailSubject = `Welcome to AutoHyve!`;
                        mailText = (0, garage_partner_welcome_email_1.default)({
                            partnerName: (0, capitalize_1.default)(partnerValues.name),
                            password: userValues.rawPassword,
                            appUrl: process.env.CLIENT_HOST,
                        });
                        //find garage category
                        category = await dao_1.default.categoryDAOService.findByAny({
                            where: {
                                name: value.category,
                            },
                        });
                        //find garage admin role
                        role = await dao_1.default.roleDAOService.findByAny({
                            where: { slug: settings_1.default.roles[4] },
                        });
                    }
                    //Ride-Share Partner
                    if (value.category === constants_1.CATEGORIES[4].name) {
                        mailSubject = `Welcome to Jiffix Hyve!`;
                        mailText = (0, ride_share_partner_welcome_email_1.default)({
                            partnerName: (0, capitalize_1.default)(partnerValues.name),
                            password: userValues.rawPassword,
                            appUrl: process.env.CLIENT_HOST,
                        });
                        //find ride-share category
                        category = await dao_1.default.categoryDAOService.findByAny({
                            where: {
                                name: value.category,
                            },
                        });
                        //find ride-share admin role
                        role = await dao_1.default.roleDAOService.findByAny({
                            where: { slug: settings_1.default.roles[6] },
                        });
                    }
                    if (!category)
                        return reject(CustomAPIError_1.default.response(`Category does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
                    if (!role)
                        return reject(CustomAPIError_1.default.response(`Role does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const logo = files.logo;
                    const basePath = `${constants_1.UPLOAD_BASE_PATH}/partners`;
                    if (logo) {
                        partnerValues.logo = await Generic_1.default.getImagePath({
                            tempPath: logo.filepath,
                            filename: logo.originalFilename,
                            basePath,
                        });
                    }
                    //create partner
                    const partner = await dao_1.default.partnerDAOService.create(partnerValues);
                    //create default admin user
                    const user = await dao_1.default.userDAOService.create(userValues);
                    const contact = await dao_1.default.contactDAOService.create(contactValues);
                    await user.$add('roles', [role]);
                    await partner.$add('categories', [category]);
                    await partner.$set('contact', contact);
                    await partner.$set('users', user);
                    const result = PartnerController.formatPartner(partner);
                    await rabbitmq_email_manager_1.QueueManager.publish({
                        queue: constants_1.QUEUE_EVENTS.name,
                        data: {
                            to: user.email,
                            from: {
                                name: process.env.SMTP_EMAIL_FROM_NAME,
                                address: process.env.SMTP_EMAIL_FROM,
                            },
                            subject: mailSubject,
                            html: mailText,
                            bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                        },
                    });
                    const response = {
                        message: HttpStatus_1.default.OK.value,
                        code: HttpStatus_1.default.OK.code,
                        result,
                    };
                    return resolve(response);
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    }
    async togglePartner(req) {
        // start
        try {
            const partnerId = req.params.partnerId;
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId, { include: [{ all: true }] });
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response('Customer does not exist', HttpStatus_1.default.NOT_FOUND.code));
            console.log(partner, "partner");
            const user_id = partner.users[0].id;
            const user_active = partner.users[0].active;
            await User_1.default.update({
                active: !user_active,
            }, {
                where: {
                    id: user_id
                }
            });
            return Promise.resolve({
                code: HttpStatus_1.default.OK.code,
                message: `Partner Account Adjusted successfully.`
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
        // end
    }
    async deletePartner(req) {
        try {
            const partnerId = req.params.partnerId;
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId, { include: [{ all: true }] });
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response('Customer does not exist', HttpStatus_1.default.NOT_FOUND.code));
            const estimates = await partner.$get('estimates');
            await partner.$remove('estimates', estimates);
            for (let i = 0; i < estimates.length; i++) {
                await estimates[i].destroy();
            }
            await partner.destroy();
            return Promise.resolve({
                code: HttpStatus_1.default.OK.code,
                message: `Partner deleted successfully.`,
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name createKyc
     * @param req
     */
    async createKyc(req) {
        const partnerId = req.params.partnerId;
        try {
            const { error, value } = joi_1.default.object({
                cac: joi_1.default.string().allow('').label('CAC'),
                name: joi_1.default.string().label('Company Full Name'),
                nameOfDirector: joi_1.default.string().allow('').label('Name of Director'),
                nameOfManager: joi_1.default.string().allow('').label('Name of Manager'),
                vatNumber: joi_1.default.string().allow('').label('VAT Number'),
                workshopAddress: joi_1.default.string().allow('').label('Workshop Address'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId, {
                include: [{ all: true }],
            });
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner with id ${partnerId} does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
            for (const valueKey in value) {
                if (value[valueKey].length) {
                    await partner.update({ [valueKey]: value[valueKey] });
                }
            }
            if (value.workshopAddress.length) {
                const contact = await partner.$get('contact');
                if (contact) {
                    await contact.update({ address: value.workshopAddress });
                    await partner.$set('contact', contact);
                }
            }
            const result = PartnerController.formatPartner(partner);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Updated KYC Successfully`,
                result,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name createSettings
     * @param req
     */
    async createSettings(req) {
        const partnerId = req.params.partnerId;
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                const logo = files.logo;
                const basePath = `${constants_1.UPLOAD_BASE_PATH}/partners`;
                try {
                    const { error, value } = joi_1.default.object({
                        accountName: joi_1.default.string().allow('').label('Account Name'),
                        accountNumber: joi_1.default.string().allow('').label('Account Number'),
                        bankName: joi_1.default.string().allow('').label('Bank Name'),
                        googleMap: joi_1.default.string().allow('').label('Google Map Link'),
                        logo: joi_1.default.binary().allow().label('Company Logo'),
                        phone: joi_1.default.string().allow('').label('Phone'),
                        totalStaff: joi_1.default.string().allow('').label('Total Staff'),
                        totalTechnicians: joi_1.default.string().allow('').label('Total Technicians'),
                        brands: joi_1.default.string().allow('').label('Company Brands'),
                        workingHours: joi_1.default.string().allow('').label('Working Hours'),
                    }).validate(fields);
                    if (error)
                        return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                    const partner = await dao_1.default.partnerDAOService.findById(+partnerId, {
                        include: [{ all: true }],
                    });
                    if (!partner)
                        return reject(CustomAPIError_1.default.response(`Partner with id ${partnerId} does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
                    value.brands = JSON.parse(value.brands);
                    value.workingHours = JSON.parse(value.workingHours);
                    for (const valueKey in value) {
                        if (valueKey !== 'logo' && value[valueKey].length) {
                            await partner.update({ [valueKey]: value[valueKey] });
                        }
                    }
                    if (logo) {
                        partner.set({
                            logo: await Generic_1.default.getImagePath({
                                tempPath: logo.filepath,
                                filename: logo.originalFilename,
                                basePath,
                            }),
                        });
                        await partner.save();
                    }
                    const partnerJson = partner.toJSON();
                    const response = {
                        code: HttpStatus_1.default.OK.code,
                        message: `Updated Settings Successfully`,
                        result: partnerJson,
                    };
                    resolve(response);
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    }
    /**
     * @name getPartners
     */
    async getPartners() {
        try {
            const partners = await dao_1.default.partnerDAOService.findAll({
                include: [Category_1.default, User_1.default, Contact_1.default],
            });
            const results = PartnerController.formatPartners(partners);
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                results,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name getPartner
     * @param id
     */
    async getPartner(id) {
        try {
            const partner = await dao_1.default.partnerDAOService.findById(id, {
                include: [Category_1.default, User_1.default, Contact_1.default],
            });
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
            const result = PartnerController.formatPartner(partner);
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name addPlan
     * @param body
     * @param partnerId
     */
    async addPlan(body, partnerId) {
        try {
            const { error, value } = joi_1.default.object(Plan_1.$planSchema).validate(body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            if (undefined === value)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
            const planExist = await dao_1.default.planDAOService.findByAny({
                where: { label: value.label },
            });
            if (planExist)
                return Promise.reject(CustomAPIError_1.default.response(`Plan with name ${value.label} already exist.`, HttpStatus_1.default.BAD_REQUEST.code));
            const partner = await dao_1.default.partnerDAOService.findById(partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner with ${partnerId} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            const category = await dao_1.default.categoryDAOService.findByAny({
                where: { name: value.serviceMode },
            });
            if (!category)
                return Promise.reject(CustomAPIError_1.default.response(`Category with ${value.serviceMode} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            //todo: use type of programme to find subscription
            const subValues = {
                name: value.label,
                slug: Generic_1.default.generateSlug(value.label),
            };
            const subscription = await dao_1.default.subscriptionDAOService.create(subValues);
            if (!subscription)
                return Promise.reject(CustomAPIError_1.default.response(`Error adding subscription.`, HttpStatus_1.default.BAD_REQUEST.code));
            Object.assign(value, {
                label: Generic_1.default.generateSlug(`${value.label} (${value.serviceMode})`),
            });
            const plan = await dao_1.default.planDAOService.create(value);
            await subscription.$add('plans', [plan]);
            await partner.$add('plans', [plan]);
            await plan.$add('categories', [category]);
            const plans = await dao_1.default.planDAOService.findAll({
                include: [{ model: Partner_1.default, where: { id: partnerId } }],
            });
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                results: plans,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name addPaymentPlan
     * @param body
     * @param partnerId
     */
    async addPaymentPlan(body, partnerId) {
        try {
            const { value, error } = joi_1.default.object(PaymentPlan_1.$paymentPlanSchema).validate(body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            if (undefined === value)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
            const partner = await dao_1.default.partnerDAOService.findById(partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner with ${partnerId} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            const plan = await dao_1.default.planDAOService.findByAny({
                where: { label: value.plan },
            });
            if (!plan)
                return Promise.reject(CustomAPIError_1.default.response(`Plan with ${value.plan} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            const serviceMode = plan.serviceMode;
            const serviceModeCategory = await dao_1.default.categoryDAOService.findByAny({
                where: { name: serviceMode },
            });
            if (!serviceModeCategory)
                return Promise.reject(CustomAPIError_1.default.response(`Service Mode Category with ${serviceMode} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            const paymentGateway = await dao_1.default.paymentGatewayDAOService.findByAny({
                where: { default: true },
            });
            if (!paymentGateway)
                return Promise.reject(CustomAPIError_1.default.response(`No default payment gateway available.`, HttpStatus_1.default.NOT_FOUND.code));
            const pricing = value.pricing;
            const axiosResponse = await axiosClient_1.default.get(`${paymentGateway.baseUrl}/plan`);
            const _gwPaymentPlans = axiosResponse.data.data;
            pricing.map(async (price) => {
                const name = capitalize_1.default.words(`${price.interval} ${value.name}`);
                const exist = _gwPaymentPlans.find((value) => value.name === name);
                //Only create non-existing plan in paystack
                if (!exist) {
                    const payload = {
                        name,
                        interval: price.interval,
                        amount: `${+price.amount * 100}`,
                    };
                    const response = await axiosClient_1.default.post(`${paymentGateway.baseUrl}/plan`, payload, {
                        headers: {
                            Authorization: `Bearer ${paymentGateway.secretKey}`,
                        },
                    });
                    return response.data;
                }
                return exist;
            });
            const paymentPlanData = pricing.map(price => ({
                discount: +value.discount,
                hasPromo: value.discount.length !== 0,
                name: capitalize_1.default.words(`${price.interval} ${value.name}`),
                label: Generic_1.default.generateSlug(`${plan.serviceMode} ${value.name}`),
                value: price.amount,
                coverage: value.coverage,
                descriptions: value.descriptions.map(value => JSON.stringify({ ...value })),
                parameters: value.parameters.map(value => JSON.stringify({ ...value })),
                pricing: value.pricing.map(value => JSON.stringify({ ...value })),
            }));
            //check if name and label already exist
            for (const datum of paymentPlanData) {
                const exist = await dao_1.default.paymentPlanDAOService.findByAny({
                    where: {
                        [sequelize_1.Op.or]: [{ name: datum.name }, { label: datum.label }],
                    },
                });
                if (exist) {
                    return Promise.reject(CustomAPIError_1.default.response(`Payment Plan with info: ${datum.name} already exist.`, HttpStatus_1.default.BAD_REQUEST.code));
                }
            }
            const paymentPlan = await dao_1.default.paymentPlanDAOService.bulkCreate(paymentPlanData);
            //link plan payment plans
            await plan.$add('paymentPlans', paymentPlan);
            const paymentPlans = await dao_1.default.paymentPlanDAOService.findAll({
                include: [{ model: Plan_1.default, where: { partnerId: partnerId } }],
            });
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                results: paymentPlans,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name getPlans
     * @param partnerId
     */
    async getPlans(partnerId) {
        try {
            const plans = await dao_1.default.planDAOService.findAll({
                include: [{ model: Partner_1.default, where: { id: partnerId } }],
            });
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                results: plans,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name getPaymentPlans
     * @param partnerId
     */
    async getPaymentPlans(partnerId) {
        try {
            const partner = await dao_1.default.partnerDAOService.findById(partnerId, {
                include: [Plan_1.default],
            });
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner with ${partnerId} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            const paymentPlans = await dao_1.default.paymentPlanDAOService.findAll({
                include: [{ model: Plan_1.default, where: { partnerId: partnerId } }],
            });
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                results: paymentPlans,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async filterDrivers(req) {
        const partnerId = req.params.partnerId;
        const driverInfo = [];
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: driverInfo,
        };
        try {
            const { error, value } = joi_1.default.object({
                email: joi_1.default.string().email().allow('').label('Email'),
                firstName: joi_1.default.string().allow('').label('First Name'),
                lastName: joi_1.default.string().allow('').label('Last Name'),
                plateNumber: joi_1.default.string().allow('').label('Plate Number'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const driverInfo = [];
            const hasValues = lodash_1.default.values(value).some(filter => filter.length > 0);
            if (!hasValues)
                return Promise.resolve(response);
            for (const valueKey in value) {
                if (valueKey === 'plateNumber') {
                    const vehicle = await dao_1.default.vehicleDAOService.findByAny({
                        where: { plateNumber: value[valueKey] },
                    });
                    if (!vehicle)
                        return Promise.resolve(response);
                    const driver = await vehicle.$get('rideShareDriver');
                    if (!driver)
                        return Promise.resolve(response);
                    driverInfo.push({
                        id: driver.id,
                        fullName: `${driver.firstName} ${driver.lastName}`,
                    });
                    response.results = driverInfo;
                }
                const driver = await dao_1.default.rideShareDriverDAOService.findByAny({
                    where: {
                        [valueKey]: {
                            // @ts-ignore
                            [sequelize_1.Op.iLike]: value[valueKey],
                        },
                    },
                });
                if (!driver)
                    return Promise.resolve(response);
                driverInfo.push({
                    id: driver.id,
                    fullName: `${driver.firstName} ${driver.lastName}`,
                });
                response.results = driverInfo;
            }
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async driversFilterData(req) {
        const partnerId = req.params.partnerId;
        const path = req.path;
        path.search('owners-filter-data');
        const driverInfo = [];
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: driverInfo,
        };
        try {
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            let drivers = [];
            switch (path) {
                case path.match('owners-filter-data')?.input:
                    drivers = await dao_1.default.customerDAOService.findAll({
                        where: {
                            [sequelize_1.Op.not]: { firstName: 'Anonymous' },
                        },
                    });
                    break;
                case path.match('drivers-filter-data')?.input:
                    drivers = await dao_1.default.rideShareDriverDAOService.findAll();
                    break;
                default:
            }
            if (!drivers.length)
                return Promise.resolve(response);
            for (let i = 0; i < drivers.length; i++) {
                const driver = drivers[i];
                // const fullName = `${driver.firstName} ${driver.lastName} ${driver.email} ${driver.companyName}`;
                const fullName = `${driver.firstName} ${driver.lastName} ${driver.phone} ${driver.email} ${driver.companyName}`;
                const email = driver.email;
                const vehicles = await drivers[i].$get('vehicles');
                console.log(vehicles.length, " vehicles");
                driverInfo[i] = {
                    id: driver.id,
                    fullName,
                    query: `${email} ${fullName}`,
                };
                for (let j = 0; j < vehicles.length; j++) {
                    const vehicle = vehicles[j];
                    Object.assign(driverInfo[i], {
                        query: `${driverInfo[i].query} ${vehicle.plateNumber} ${vehicle.vin}`,
                    });
                    // Object.assign(driverInfo[i], {
                    //   fullName: `${driverInfo[i].fullName} ${(vehicle.plateNumber !== "") ? "plate:"+vehicle.plateNumber : ""} vin:${(vehicle.vin !== "") ? "vin:"+vehicle.vin : "" }`,
                    // });
                }
            }
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async jobs(req) {
        const partnerId = req.params.partnerId;
        return JobController_1.default.jobs(+partnerId);
    }
    async deletePlan(req) {
        try {
            const planId = req.query.planId;
            const paymentPlanId = req.query.paymentPlanId;
            if (planId) {
                const plan = await dao_1.default.planDAOService.findById(+planId);
                const result = plan;
                if (!plan)
                    return Promise.reject(CustomAPIError_1.default.response(`Plan does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                const subscription = await plan.$get('subscriptions');
                if (subscription) {
                    await subscription.$remove('plans', plan);
                    await subscription.destroy();
                }
                await plan.destroy();
                const response = {
                    code: HttpStatus_1.default.OK.code,
                    message: `Deleted plan successfully.`,
                    result,
                };
                return Promise.resolve(response);
            }
            if (paymentPlanId) {
                const paymentPlan = await dao_1.default.paymentPlanDAOService.findById(+paymentPlanId);
                const result = paymentPlan;
                if (!paymentPlan)
                    return Promise.reject(CustomAPIError_1.default.response(`Payment Plan does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                const plan = await dao_1.default.planDAOService.findById(paymentPlan.planId);
                if (!plan)
                    return Promise.reject(CustomAPIError_1.default.response(`Plan does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                await plan.$remove('paymentPlans', paymentPlan);
                await paymentPlan.destroy();
                const response = {
                    code: HttpStatus_1.default.OK.code,
                    message: `Deleted Payment Plan successfully.`,
                    result,
                };
                return Promise.resolve(response);
            }
            return Promise.reject({
                code: HttpStatus_1.default.BAD_REQUEST.code,
                message: HttpStatus_1.default.BAD_REQUEST.value,
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = PartnerController;
