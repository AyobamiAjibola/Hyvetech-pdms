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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Estimate_1 = __importStar(require("../models/Estimate"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const Contact_1 = __importDefault(require("../models/Contact"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const constants_1 = require("../config/constants");
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const Partner_1 = __importDefault(require("../models/Partner"));
const Customer_1 = __importDefault(require("../models/Customer"));
const RideShareDriver_1 = __importDefault(require("../models/RideShareDriver"));
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const BillingInformation_1 = __importDefault(require("../models/BillingInformation"));
const decorators_1 = require("../decorators");
const sequelize_1 = require("sequelize");
const rabbitmq_email_manager_1 = __importDefault(require("rabbitmq-email-manager"));
const User_1 = __importDefault(require("../models/User"));
const new_estimate_1 = __importDefault(require("../resources/templates/email/new_estimate"));
const sendMail_1 = require("../utils/sendMail");
class EstimateController {
    async create(req) {
        const { estimate, customer, vehicle, partner } = await this.doCreateEstimate(req);
        try {
            // console.log('before 1')
            await estimate.update({
                status: constants_1.ESTIMATE_STATUS.sent,
            });
            // console.log('before 2')
            AppEventEmitter_1.appEventEmitter.emit(constants_1.CREATED_ESTIMATE, { estimate, customer, vehicle, partner });
            // console.log('before 3')
        }
        catch (e) {
            console.log(e);
        }
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Estimate created successfully.',
            result: estimate,
        };
        return Promise.resolve(response);
    }
    async delete(req) {
        const estimateId = req.params.estimateId;
        const estimate = await dao_1.default.estimateDAOService.findById(+estimateId);
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found`, HttpStatus_1.default.NOT_FOUND.code));
        if (estimate.status === constants_1.ESTIMATE_STATUS.invoiced)
            return Promise.reject(CustomAPIError_1.default.response(`Cannot delete an already invoiced estimate`, HttpStatus_1.default.BAD_REQUEST.code));
        await Estimate_1.default.destroy({ where: { id: +estimateId }, force: true });
        return Promise.resolve({
            code: HttpStatus_1.default.ACCEPTED.code,
            message: 'Estimate deleted successfully',
        });
    }
    async save(req) {
        const { estimate } = await this.doSaveEstimate(req);
        await estimate.update({
            status: constants_1.ESTIMATE_STATUS.draft,
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Estimate saved successfully.',
            result: estimate,
        };
        return Promise.resolve(response);
    }
    async update(req) {
        const { estimate } = await this.doUpdateEstimate(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Estimate updated successfully.',
            result: estimate,
        };
        return Promise.resolve(response);
    }
    async sendDraft(req) {
        const estimateId = req.params.estimateId;
        const estimate = await dao_1.default.estimateDAOService.findById(+estimateId);
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found`, HttpStatus_1.default.NOT_FOUND.code));
        const customer = await estimate.$get('customer');
        if (!customer)
            return Promise.reject(CustomAPIError_1.default.response(`Customer does not found`, HttpStatus_1.default.BAD_REQUEST.code));
        let vehicle = await estimate.$get('vehicle');
        if (!vehicle) {
            const value = req.body;
            const data = {
                vin: value.vin,
                make: value.make,
                model: value.model,
                modelYear: value.modelYear,
                plateNumber: value.plateNumber,
                mileageValue: value.mileageValue,
                mileageUnit: value.mileageUnit,
            };
            vehicle = await dao_1.default.vehicleDAOService.create(data);
            await customer.$add('vehicles', [vehicle]);
            await vehicle.$add('estimates', [estimate]);
            // return Promise.reject(CustomAPIError.response(`Vehicle not found`, HttpStatus.BAD_REQUEST.code))
        }
        const partner = await estimate.$get('partner', { include: [Contact_1.default] });
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner not found`, HttpStatus_1.default.BAD_REQUEST.code));
        const { error, value } = joi_1.default.object(Estimate_1.$createEstimateSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (estimate.status === constants_1.ESTIMATE_STATUS.invoiced) {
            return Promise.reject(CustomAPIError_1.default.response(`Estimate can not be edited! Customer have made a deposit. Please refresh page.`, HttpStatus_1.default.BAD_REQUEST.code));
        }
        for (const valueKey in value) {
            const key = valueKey;
            if (key === 'id')
                continue;
            if (key === 'parts') {
                await estimate.update({
                    [key]: value.parts.map(value => JSON.stringify(value)),
                });
                continue;
            }
            if (key === 'labours') {
                await estimate.update({
                    [key]: value.labours.map(value => JSON.stringify(value)),
                });
                continue;
            }
            if (key === 'depositAmount') {
                await estimate.update({
                    [key]: parseInt(`${value.depositAmount}`),
                });
                continue;
            }
            if (key === 'jobDurationValue') {
                await estimate.update({
                    [key]: parseInt(`${value.jobDurationValue}`),
                });
                continue;
            }
            await estimate.update({
                [key]: value[key],
            });
        }
        const vin = await dao_1.default.vinDAOService.findByAny({ where: { vin: value.vin } });
        if (vin)
            await vin.update({ plateNumber: value.plateNumber });
        await vehicle.update({ plateNumber: value.plateNumber });
        await estimate.update({
            status: constants_1.ESTIMATE_STATUS.sent,
        });
        let user = customer;
        const mail = (0, new_estimate_1.default)({
            firstName: customer.firstName,
            lastName: customer.lastName,
            partner,
            estimate,
            vehichleData: `${value.modelYear} ${value.make} ${value.model} `
        });
        await rabbitmq_email_manager_1.default.publish({
            queue: constants_1.QUEUE_EVENTS.name,
            data: {
                to: user.email,
                replyTo: partner.email,
                // @ts-ignore
                'reply-to': partner.email,
                from: {
                    name: "AutoHyve",
                    address: process.env.SMTP_EMAIL_FROM2,
                },
                subject: `${partner.name} has sent you an estimate on AutoHyve`,
                html: mail,
                bcc: [process.env.SMTP_BCC],
            },
        });
        AppEventEmitter_1.appEventEmitter.emit(constants_1.CREATED_ESTIMATE, { estimate, customer, vehicle, partner });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Estimate sent successfully.',
            result: estimate,
        };
        return Promise.resolve(response);
    }
    async estimates(req) {
        const partner = req.user.partner;
        let estimates;
        //Super Admin should see all estimates
        if (!partner) {
            estimates = await dao_1.default.estimateDAOService.findAll({
                include: [
                    Vehicle_1.default,
                    { model: Customer_1.default, include: [BillingInformation_1.default], paranoid: false },
                    RideShareDriver_1.default,
                    { model: Partner_1.default, include: [Contact_1.default] },
                ],
            });
        }
        else {
            estimates = await partner.$get('estimates', {
                include: [
                    Vehicle_1.default,
                    { model: Customer_1.default, include: [BillingInformation_1.default], paranoid: false },
                    RideShareDriver_1.default,
                    { model: Partner_1.default, include: [Contact_1.default] },
                ],
            });
        }
        // sort by date updated
        for (let i = 1; i < estimates.length; i++) {
            for (let j = i; j > 0; j--) {
                const _t1 = estimates[j];
                const _t0 = estimates[j - 1];
                if (((new Date(_t1.updatedAt)).getTime()) > ((new Date(_t0.updatedAt)).getTime())) {
                    estimates[j] = _t0;
                    estimates[j - 1] = _t1;
                    // console.log('sorted')
                }
                else {
                    // console.log('no sorted')
                }
            }
        }
        estimates = (estimates).map(estimate => {
            const parts = estimate.parts;
            const labours = estimate.labours;
            estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [constants_1.INITIAL_PARTS_VALUE];
            estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [constants_1.INITIAL_LABOURS_VALUE];
            return estimate;
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: estimates,
        };
        return Promise.resolve(response);
    }
    async doCreateEstimate(req) {
        const { error, value } = joi_1.default.object(Estimate_1.$createEstimateSchema).validate(req.body);
        // console.log(error)
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.INTERNAL_SERVER_ERROR.value, HttpStatus_1.default.INTERNAL_SERVER_ERROR.code));
        const partner = await dao_1.default.partnerDAOService.findById(value.id, { include: [Contact_1.default, User_1.default] });
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${value.id} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        // check if partner is active
        try {
            if ((!(partner?.users[0]?.active || true) || false)) {
                return Promise.reject(CustomAPIError_1.default.response(`Partner Account Inactive`, HttpStatus_1.default.NOT_FOUND.code));
            }
        }
        catch (_e) { }
        const findVehicle = await dao_1.default.vehicleDAOService.findByVIN(value.vin);
        let vehicle, customer;
        if (!findVehicle) {
            const data = {
                vin: value.vin,
                make: value.make,
                model: value.model,
                modelYear: value.modelYear,
                plateNumber: value.plateNumber,
                mileageValue: value.mileageValue,
                mileageUnit: value.mileageUnit,
            };
            const vin = await dao_1.default.vinDAOService.findByAny({
                where: { vin: value.vin },
            });
            const isVinExistMandatory = false;
            if (isVinExistMandatory) {
                if (!vin)
                    return Promise.reject(CustomAPIError_1.default.response(`VIN: ${value.vin} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
                await vin.update({
                    plateNumber: value.plateNumber,
                });
            }
            vehicle = await dao_1.default.vehicleDAOService.create(data);
        }
        else {
            const vin = await dao_1.default.vinDAOService.findByAny({
                where: { vin: value.vin },
            });
            if (!vin)
                return Promise.reject(CustomAPIError_1.default.response(`VIN: ${value.vin} does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            vehicle = await findVehicle.update({
                vin: value.vin.length ? value.vin : findVehicle.vin,
                make: value.make.length ? value.make : findVehicle.make,
                model: value.model.length ? value.model : findVehicle.model,
                modelYear: value.modelYear.length ? value.modelYear : findVehicle.modelYear,
                mileageValue: value.mileageValue.length ? value.mileageValue : findVehicle.mileageValue,
                mileageUnit: value.mileageUnit.length ? value.mileageUnit : findVehicle.mileageUnit,
                plateNumber: value.plateNumber.length ? value.plateNumber : findVehicle.plateNumber,
            });
            await vin.update({
                plateNumber: value.plateNumber,
            });
        }
        const findCustomer = await dao_1.default.customerDAOService.findByAny({
            where: {
                email: value.email
            },
            include: [Contact_1.default],
        });
        if (!findCustomer) {
            const data = {
                firstName: value.firstName,
                lastName: value.lastName,
                phone: value.phone,
                email: value.email,
            };
            // check if it's not super admin
            console.log(req?.user.partner?.id);
            if (req?.user.partner?.id != 0) {
                data.partnerId = req?.user.partner?.id;
                console.log(req?.user.partner?.id, data);
            }
            customer = await dao_1.default.customerDAOService.create(data);
            await customer.$set('vehicles', [vehicle]);
            // try to link a contact with this customer
            const contactValue = {
                label: "Home",
                // @ts-ignore
                state: value?.state || "Abuja (FCT)"
            };
            const contact = await dao_1.default.contactDAOService.create(contactValue);
            await customer.$set('contacts', [contact]);
            // send email of user info
            // start
            // let user: any = customer;
            // const mailText = create_customer_success_email({
            //   username: user.email,
            //   password: user.password,
            //   loginUrl: process.env.CUSTOMER_APP_HOST,
            // });
            // const mail = email_content({
            //   firstName: user?.firstName,
            //   text: mailText,
            //   signature: process.env.SMTP_EMAIL_SIGNATURE,
            // });
            // const mail = create_customer_from_estimate({
            //   firstName: customer.firstName,
            //   lastName: customer.lastName,
            //   partner,
            //   vehichleData: `${value.modelYear} ${value.make} ${value.model}`
            // })
            // //todo: Send email with credentials
            // await QueueManager.publish({
            //   queue: QUEUE_EVENTS.name,
            //   data: {
            //     to: user.email,
            //     from: {
            //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            //       address: <string>process.env.SMTP_EMAIL_FROM,
            //     },
            //     subject: `You Have a New Estimate`,
            //     html: mail,
            //     bcc: [<string>process.env.SMTP_EMAIL_FROM],
            //   },
            // });
            // stop
        }
        else {
            await findCustomer.$add('vehicles', [vehicle]);
            customer = findCustomer;
            // send mail to customer also
            // let user: any = customer;
            // const mail = new_estimate_template({
            //   firstName: customer.firstName,
            //   lastName: customer.lastName,
            //   partner,
            //   vehichleData: `${value.modelYear} ${value.make} ${value.model}`
            // })
            // //todo: Send email with credentials
            // await QueueManager.publish({
            //   queue: QUEUE_EVENTS.name,
            //   data: {
            //     to: user.email,
            //     from: {
            //       name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            //       address: <string>process.env.SMTP_EMAIL_FROM,
            //     },
            //     subject: `You Have a New Estimate`,
            //     html: mail,
            //     bcc: [<string>process.env.SMTP_EMAIL_FROM],
            //   },
            // });
        }
        const estimateValues = {
            jobDurationUnit: value.jobDurationUnit,
            labours: value.labours.map(value => JSON.stringify(value)),
            parts: value.parts.map(value => JSON.stringify(value)),
            depositAmount: parseInt(`${value.depositAmount}`),
            grandTotal: value.grandTotal,
            jobDurationValue: parseInt(`${value.jobDurationValue}`),
            laboursTotal: value.laboursTotal,
            partsTotal: value.partsTotal,
            address: value.address,
            addressType: value.addressType,
            tax: value.tax,
            taxPart: value.taxPart,
            code: Generic_1.default.randomize({ count: 6, number: true }),
            expiresIn: constants_1.ESTIMATE_EXPIRY_DAYS,
        };
        const estimate = await dao_1.default.estimateDAOService.create(estimateValues);
        await partner.$add('estimates', [estimate]);
        await vehicle.$add('estimates', [estimate]);
        await customer.$add('estimates', [estimate]);
        // console.log('reach0')
        // send mail
        let user = customer;
        const mail = (0, new_estimate_1.default)({
            firstName: customer.firstName,
            lastName: customer.lastName,
            partner,
            estimate,
            vehichleData: `${value.modelYear} ${value.make} ${value.model} `
        });
        // console.log('reach1')
        //todo: Send email with credentials
        await (0, sendMail_1.sendMail)({
            to: user.email,
            replyTo: partner.email,
            // @ts-ignore
            'reply-to': partner.email,
            from: {
                name: "AutoHyve",
                address: process.env.SMTP_EMAIL_FROM2,
            },
            subject: `${partner.name} has sent you an estimate on AutoHyve`,
            html: mail,
            bcc: [process.env.SMTP_BCC],
        });
        // await QueueManager.publish({
        //   queue: QUEUE_EVENTS.name,
        //   data: {
        //     to: user.email,
        //     replyTo: partner.email,
        //     // @ts-ignore
        //     'reply-to': partner.email,
        //     from: {
        //       name: "AutoHyve",
        //       address: <string>process.env.SMTP_EMAIL_FROM2,
        //     },
        //     subject: `${partner.name} has sent you an estimate on AutoHyve`,
        //     html: mail,
        //     bcc: [<string>process.env.SMTP_BCC],
        //   },
        // });
        // console.log(estimate, customer, vehicle, partner, 'reach2')
        return { estimate, customer, vehicle, partner };
    }
    async doSaveEstimate(req) {
        const { error, value } = joi_1.default.object(Estimate_1.$saveEstimateSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.INTERNAL_SERVER_ERROR.value, HttpStatus_1.default.INTERNAL_SERVER_ERROR.code));
        const partner = await dao_1.default.partnerDAOService.findById(value.id, { include: [Contact_1.default] });
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${value.id} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        let vehicle = null, customer;
        if (value.vin) {
            const findVehicle = await dao_1.default.vehicleDAOService.findByVIN(value.vin);
            if (!findVehicle) {
                const data = {
                    vin: value.vin,
                    make: value.make,
                    model: value.model,
                    modelYear: value.modelYear,
                    plateNumber: value.plateNumber,
                    mileageValue: value.mileageValue,
                    mileageUnit: value.mileageUnit,
                };
                const vin = await dao_1.default.vinDAOService.findByAny({
                    where: { vin: value.vin },
                });
                // disable vin doesn't exist
                if (!vin) {
                    // return Promise.reject(
                    //   CustomAPIError.response(`VIN: ${value.vin} does not exist.`, HttpStatus.NOT_FOUND.code),
                    // );
                }
                else {
                    // @ts-ignore
                    await vin.update({
                        plateNumber: value.plateNumber,
                    });
                }
                vehicle = await dao_1.default.vehicleDAOService.create(data);
            }
            else {
                vehicle = await findVehicle.update({
                    vin: value.vin.length ? value.vin : findVehicle.vin,
                    make: value.make.length ? value.make : findVehicle.make,
                    model: value.model.length ? value.model : findVehicle.model,
                    modelYear: value.modelYear.length ? value.modelYear : findVehicle.modelYear,
                    mileageValue: value.mileageValue.length ? value.mileageValue : findVehicle.mileageValue,
                    mileageUnit: value.mileageUnit.length ? value.mileageUnit : findVehicle.mileageUnit,
                    plateNumber: value.plateNumber.length ? value.plateNumber : findVehicle.plateNumber,
                });
            }
        }
        const findCustomer = await dao_1.default.customerDAOService.findByAny({
            where: {
                email: value.email
            },
            include: [Contact_1.default],
        });
        if (!findCustomer) {
            const data = {
                firstName: value.firstName,
                lastName: value.lastName,
                phone: value.phone,
                email: value.email,
            };
            // check if it's not super admin
            if (req?.user.partner?.id != 0) {
                data.partnerId = req?.user.partner?.id;
            }
            customer = await dao_1.default.customerDAOService.create(data);
            if (vehicle)
                await customer.$set('vehicles', [vehicle]);
            try {
                const contactValue = {
                    label: "Home",
                    // @ts-ignore
                    state: value?.state || "Abuja (FCT)"
                };
                const contact = await dao_1.default.contactDAOService.create(contactValue);
                await customer.$set('contacts', [contact]);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            if (vehicle)
                await findCustomer.$add('vehicles', [vehicle]);
            customer = findCustomer;
        }
        const estimateValues = {
            jobDurationUnit: value.jobDurationUnit,
            labours: value.labours.map(value => JSON.stringify(value)),
            parts: value.parts.map(value => JSON.stringify(value)),
            depositAmount: parseInt(`${value.depositAmount}`),
            jobDurationValue: parseInt(`${value.jobDurationValue}`),
            grandTotal: value.grandTotal,
            laboursTotal: value.laboursTotal,
            partsTotal: value.partsTotal,
            address: value.address,
            addressType: value.addressType,
            tax: value.tax,
            taxPart: value.taxPart,
            code: Generic_1.default.randomize({ count: 6, number: true }),
            expiresIn: constants_1.ESTIMATE_EXPIRY_DAYS,
        };
        const estimate = await dao_1.default.estimateDAOService.create(estimateValues);
        await partner.$add('estimates', [estimate]);
        if (vehicle)
            await vehicle.$add('estimates', [estimate]);
        try {
            await customer.$add('estimates', [estimate]);
        }
        catch (e) {
            console.log(e);
        }
        return { estimate, customer, vehicle, partner };
    }
    async doUpdateEstimate(req) {
        const estimateId = req.params.estimateId;
        const estimate = await dao_1.default.estimateDAOService.findById(+estimateId);
        if (!estimate)
            return Promise.reject(CustomAPIError_1.default.response(`Estimate not found`, HttpStatus_1.default.NOT_FOUND.code));
        if (estimate.status === constants_1.ESTIMATE_STATUS.invoiced)
            return Promise.reject(CustomAPIError_1.default.response(`Customer have already made a deposit for this estimate. Kindly refresh page.`, HttpStatus_1.default.NOT_FOUND.code));
        const { error, value } = joi_1.default.object(Estimate_1.$updateEstimateSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.INTERNAL_SERVER_ERROR.value, HttpStatus_1.default.INTERNAL_SERVER_ERROR.code));
        if (value.vin || value.plateNumber) {
            const vehicle = await dao_1.default.vehicleDAOService.findByAny({
                where: {
                    [sequelize_1.Op.or]: [{ vin: value.vin }, { plateNumber: value.plateNumber }],
                },
            });
            if (!vehicle)
                return Promise.reject(CustomAPIError_1.default.response(`Vehicle with VIN or plate number does not exist.`, HttpStatus_1.default.NOT_FOUND.code));
            for (const valueKey in value) {
                const key = valueKey;
                if (key === 'id')
                    continue;
                if (value[key]) {
                    await vehicle.update({
                        [key]: value[key],
                    });
                }
            }
            await vehicle.$add('estimates', [estimate]);
        }
        const estimateValues = {
            jobDurationUnit: value.jobDurationUnit,
            labours: value.labours.map(value => JSON.stringify(value)),
            parts: value.parts.map(value => JSON.stringify(value)),
            grandTotal: value.grandTotal,
            depositAmount: parseInt(`${value.depositAmount}`),
            jobDurationValue: parseInt(`${value.jobDurationValue}`),
            laboursTotal: value.laboursTotal,
            partsTotal: value.partsTotal,
            address: value.address,
            addressType: value.addressType,
            tax: value.tax,
            taxPart: value.taxPart,
        };
        await estimate.update(estimateValues);
        return { estimate };
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "create", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "delete", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "save", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "update", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "sendDraft", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "estimates", null);
exports.default = EstimateController;
