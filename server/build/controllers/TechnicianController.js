"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const rabbitmq_email_manager_1 = require("rabbitmq-email-manager");
const constants_1 = require("../config/constants");
const email_content_1 = __importDefault(require("../resources/templates/email/email_content"));
const dao_1 = __importDefault(require("../services/dao"));
const sequelize_1 = require("sequelize");
const Generic_1 = __importDefault(require("../utils/Generic"));
const User_1 = require("../models/User");
const Job_1 = __importDefault(require("../models/Job"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const create_technician_success_email_1 = __importDefault(require("../resources/templates/email/create_technician_success_email"));
class TechnicianController {
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    async create(req) {
        try {
            const { value, error } = joi_1.default.object({
                confirmPassword: joi_1.default.ref('password'),
                email: joi_1.default.string().email().required().label('Email Address'),
                firstName: joi_1.default.string().required().label('First Name'),
                lastName: joi_1.default.string().required().label('Last Name'),
                password: joi_1.default.string().required().label('Password'),
                phone: joi_1.default.string().required().label('Phone Number'),
                partnerId: joi_1.default.string().required().label('Partner Id'),
                role: joi_1.default.string().required().label('Role'),
                active: joi_1.default.boolean().truthy().required().label('Active'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const partnerId = value.partnerId;
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner with Id ${partnerId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const userExist = await dao_1.default.technicianDAOService.findByAny({
                where: {
                    [sequelize_1.Op.or]: [{ email: value.email, phone: value.phone }],
                },
            });
            if (userExist)
                return Promise.reject(CustomAPIError_1.default.response(`User with email or phone number already exist`, HttpStatus_1.default.BAD_REQUEST.code));
            //find role by name
            const role = await dao_1.default.roleDAOService.findByAny({
                where: { slug: value.role },
            });
            if (!role)
                return Promise.reject(CustomAPIError_1.default.response(`Role ${value.role} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const password = value.password;
            value.rawPassword = password;
            value.password = await this.passwordEncoder.encode(password);
            value.enabled = true;
            const user = await dao_1.default.technicianDAOService.create(value);
            //associate user with role
            await user.$add('roles', [role]);
            //associate partner with technician
            await partner.$add('technicians', [user]);
            const mailText = (0, create_technician_success_email_1.default)({
                username: user.email,
                password: user.rawPassword,
                appUrl: process.env.TECHNICIAN_APP_URL,
                whatsappUrl: process.env.WHATSAPP_URL,
            });
            const mail = (0, email_content_1.default)({
                firstName: user?.firstName,
                text: mailText,
                signature: process.env.SMTP_EMAIL_SIGNATURE,
            });
            //todo: Send email with credentials
            await rabbitmq_email_manager_1.QueueManager.publish({
                queue: constants_1.QUEUE_EVENTS.name,
                data: {
                    to: user.email,
                    from: {
                        name: process.env.SMTP_EMAIL_FROM_NAME,
                        address: process.env.SMTP_EMAIL_FROM,
                    },
                    subject: `Welcome to ${partner.name} Garage`,
                    html: mail,
                    bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                },
            });
            const technicians = await dao_1.default.technicianDAOService.findAll({
                attributes: { exclude: ['password', 'rawPassword'] },
            });
            const response = {
                message: `Technician created successfully`,
                code: HttpStatus_1.default.OK.code,
                results: technicians,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async update(req) {
        const techId = req.params.techId;
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Updated Successfully',
        };
        try {
            const { error, value } = joi_1.default.object({
                confirmPassword: joi_1.default.ref('password'),
                id: joi_1.default.string().allow().label('Technician Id'),
                email: joi_1.default.string().email().required().label('Email Address'),
                firstName: joi_1.default.string().required().label('First Name'),
                lastName: joi_1.default.string().required().label('Last Name'),
                password: joi_1.default.string().allow('').label('Password'),
                phone: joi_1.default.string().required().label('Phone Number'),
                active: joi_1.default.boolean().truthy().required().label('Active'),
                partnerId: joi_1.default.string().allow('').label('Partner Id'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const technician = await dao_1.default.technicianDAOService.findById(+techId);
            if (!technician)
                return Promise.reject(CustomAPIError_1.default.response(`User does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            //check new email and phone does not exist
            const exist = await dao_1.default.technicianDAOService.findByAny({
                where: {
                    [sequelize_1.Op.or]: [{ email: value.email }, { phone: value.phone }],
                },
            });
            //Return same result with no modification
            if (exist) {
                if (value.password.length) {
                    value.rawPassword = value.password;
                    value.password = await this.passwordEncoder.encode(value.password);
                }
                else
                    delete value.password;
                await exist.update(value);
                response.result = exist;
                return Promise.resolve(response);
            }
            if (value.password.length) {
                const password = Generic_1.default.generateRandomString(8);
                value.password = await this.passwordEncoder.encode(password);
                value.rawPassword = password;
            }
            else
                delete value.password;
            // update database
            const result = await technician.update(value);
            if (!result)
                return Promise.reject(CustomAPIError_1.default.response('ErrorPage Updating Information', HttpStatus_1.default.BAD_REQUEST.code));
            response.result = result;
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async delete(req) {
        const techId = req.params.techId;
        try {
            const technician = await dao_1.default.technicianDAOService.findById(+techId);
            if (!technician)
                return Promise.reject(CustomAPIError_1.default.response(`Technician with Id ${techId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            await technician.update({
                active: false,
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Technician deactivated successfully`,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async technician(req) {
        const techId = req.params.techId;
        try {
            const technician = await dao_1.default.technicianDAOService.findById(+techId, {
                attributes: { exclude: ['password', 'loginToken', 'rawPassword'] },
            });
            if (!technician)
                return Promise.reject(CustomAPIError_1.default.response(`Technician with Id ${techId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                result: technician,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async technicians(req) {
        const partner = req.user.partner;
        let technicians;
        try {
            if (partner) {
                technicians = await partner.$get('technicians', {
                    attributes: { exclude: ['password', 'loginToken', 'rawPassword'] },
                    include: [{ model: Job_1.default, include: [Vehicle_1.default] }],
                });
            }
            else {
                technicians = await dao_1.default.technicianDAOService.findAll({
                    attributes: { exclude: ['password', 'loginToken', 'rawPassword'] },
                    include: [{ model: Job_1.default, include: [Vehicle_1.default] }],
                });
            }
            technicians = this.formatTechniciansQueryResult(technicians);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: technicians,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async partnerTechnicians(req) {
        const partnerId = req.params.partnerId;
        try {
            const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
            if (!partner)
                return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const technicians = await partner.$get('technicians', {
                attributes: { exclude: ['password', 'loginToken', 'rawPassword'] },
                include: [{ model: Job_1.default, include: [Vehicle_1.default] }],
            });
            const result = this.formatTechniciansQueryResult(technicians);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: result,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    formatTechniciansQueryResult(technicians) {
        return technicians.map(technician => {
            technician.jobs = technician.jobs.map(job => {
                job.checkList = JSON.parse(job.checkList);
                return job;
            });
            return technician;
        });
    }
    async signIn(req) {
        try {
            //validate request body
            const { error, value } = joi_1.default.object(User_1.$loginSchema).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            //find user by username
            const user = await dao_1.default.technicianDAOService.findByAny({
                where: { email: value.username },
            });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            //verify password
            const hash = user.password;
            const isMatch = await this.passwordEncoder.match(value.password, hash);
            if (!isMatch)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            const roles = await user.$get('roles');
            const permissions = [];
            for (const role of roles) {
                const _permissions = await role.$get('permissions', {
                    attributes: ['action', 'subject'],
                });
                for (const _permission of _permissions) {
                    permissions.push(_permission.toJSON());
                }
            }
            //generate JWT
            const jwt = Generic_1.default.generateJwt({
                userId: user.id,
                permissions,
            });
            //update user authentication date and authentication token
            const updateValues = {
                loginDate: new Date(),
                loginToken: jwt,
            };
            await user.update(updateValues);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Login successful',
                result: jwt,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = TechnicianController;
