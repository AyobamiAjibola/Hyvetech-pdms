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
const User_1 = require("../models/User");
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const rabbitmq_email_manager_1 = require("rabbitmq-email-manager");
const email_content_1 = __importDefault(require("../resources/templates/email/email_content"));
const create_customer_success_email_1 = __importDefault(require("../resources/templates/email/create_customer_success_email"));
const constants_1 = require("../config/constants");
const dao_1 = __importDefault(require("../services/dao"));
const settings_1 = __importDefault(require("../config/settings"));
const sequelize_1 = require("sequelize");
const Permission_1 = __importDefault(require("../models/Permission"));
const Partner_1 = __importDefault(require("../models/Partner"));
const decorators_1 = require("../decorators");
const PartnerController_1 = __importDefault(require("./PartnerController"));
const garage_partner_welcome_email_1 = __importDefault(require("../resources/templates/email/garage_partner_welcome_email"));
const capitalize_1 = __importDefault(require("capitalize"));
class AuthenticationController {
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    /**
     * @name signup
     * @param req
     */
    async signup(req) {
        try {
            const { error, value } = joi_1.default.object(User_1.$userSchema).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const userExist = await dao_1.default.userDAOService.findByAny({
                where: {
                    [sequelize_1.Op.or]: [{ email: value.email, phone: value.phone }],
                },
            });
            if (userExist)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
            //find role by name
            const role = await dao_1.default.roleDAOService.findByAny({
                where: { slug: value.role },
            });
            if (!role)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
            value.password = Generic_1.default.generateRandomString(15);
            const user = await dao_1.default.userDAOService.create(value);
            //associate user with role
            await user.$set('roles', [role]);
            const platforms = value.companyName.split(',');
            for (const platform of platforms) {
                const partner = await dao_1.default.partnerDAOService.findByAny({
                    where: { name: platform },
                });
                if (!partner)
                    return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
                await partner.$add('users', [user]);
            }
            const mailText = (0, create_customer_success_email_1.default)({
                username: user.email,
                password: user.password,
                loginUrl: process.env.CUSTOMER_APP_HOST,
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
                    subject: `Welcome to Jiffix ${value.companyName}`,
                    html: mail,
                    bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                },
            });
            const response = {
                message: `User created successfully`,
                code: HttpStatus_1.default.OK.code,
                result: user,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name signIn
     * @param req
     */
    async signIn(req) {
        try {
            //validate request body
            const { error, value } = joi_1.default.object(User_1.$loginSchema).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            //find user by username
            const user = await dao_1.default.userDAOService.findByUsername(value.username, { include: [Partner_1.default] });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            //verify password
            const hash = user.password;
            const password = value.password;
            console.log(user);
            const isMatch = await this.passwordEncoder.match(password, hash);
            if (!isMatch)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            const roles = await user.$get('roles', {
                include: [
                    {
                        model: Permission_1.default,
                        attributes: ['action', 'subject'],
                        through: { attributes: [] },
                    },
                ],
            });
            if (!roles.length)
                return Promise.reject(CustomAPIError_1.default.response(`Roles does not exist`, HttpStatus_1.default.UNAUTHORIZED.code));
            const permissions = [];
            for (const role of roles) {
                for (const _permission of role.permissions) {
                    permissions.push(_permission.toJSON());
                }
            }
            //generate JWT
            const jwt = Generic_1.default.generateJwt({
                userId: user.id,
                partnerId: user.partnerId,
                permissions,
            });
            //update user authentication date and authentication token
            const updateValues = {
                loginDate: new Date(),
                loginToken: jwt,
            };
            await dao_1.default.userDAOService.update(user, updateValues);
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
    /**
     * @name bootstrap
     * @description generate authentication token for anonymous users
     */
    async bootstrap() {
        try {
            const user = await dao_1.default.userDAOService.findByAny({
                where: {
                    username: 'guest',
                },
            });
            if (user) {
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
                await user.update({
                    loginDate: new Date(),
                    loginToken: jwt,
                });
                const response = {
                    message: HttpStatus_1.default.OK.value,
                    code: HttpStatus_1.default.OK.code,
                    result: jwt,
                };
                return Promise.resolve(response);
            }
            const rawPassword = process.env.BOOTSTRAP_PASS;
            if (undefined === rawPassword)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
            //find role by name
            const role = await dao_1.default.roleDAOService.findByAny({
                where: { slug: settings_1.default.roles[2] },
            });
            if (!role)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
            const hash = await this.passwordEncoder.encode(rawPassword);
            const guestUser = {
                firstName: 'Anonymous',
                lastName: 'Anonymous',
                username: 'guest',
                password: hash,
            };
            const created = await dao_1.default.userDAOService.create(guestUser);
            await created.$add('roles', [role]);
            const roles = await created.$get('roles');
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
                userId: created.id,
                permissions,
            });
            await created.update({
                loginDate: new Date(),
                loginToken: jwt,
            });
            const response = {
                message: HttpStatus_1.default.OK.value,
                code: HttpStatus_1.default.OK.code,
                result: jwt,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    /**
     * @name signOut
     * @param req
     */
    async signOut(req) {
        try {
            await req.user.update({ loginToken: '' });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async garageSignup(req) {
        const { error, value } = joi_1.default.object({
            firstName: joi_1.default.string().max(80).label('First Name').required(),
            lastName: joi_1.default.string().max(80).label('Last Name').required(),
            name: joi_1.default.string().required().label('Workshop/Business Name'),
            email: joi_1.default.string().email().label('Email Address').required(),
            phone: joi_1.default.string().length(11).required().label('Phone Number'),
            dialCode: joi_1.default.string().required().label('Dial Code'),
            state: joi_1.default.string().label('State').required(),
            isRegistered: joi_1.default.boolean().truthy().label('Legally Registered').required(),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        if (!value)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.BAD_REQUEST.value, HttpStatus_1.default.BAD_REQUEST.code));
        //check if partner with email or name already exist
        const partnerExist = await dao_1.default.partnerDAOService.findByAny({
            where: {
                [sequelize_1.Op.or]: [{ name: value.name }, { email: value.email }],
            },
        });
        if (partnerExist)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with name or email already exist`, HttpStatus_1.default.BAD_REQUEST.code));
        const state = await dao_1.default.stateDAOService.findByAny({
            where: {
                name: value.state,
            },
        });
        if (!state)
            return Promise.reject(CustomAPIError_1.default.response(`State does not exist`, HttpStatus_1.default.NOT_FOUND.code));
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
            firstName: value.firstName,
            lastName: value.lastName,
            active: true,
            password,
            rawPassword: password,
        };
        const contactValues = {
            state: state.name,
            country: 'Nigeria',
        };
        //find garage category
        const category = await dao_1.default.categoryDAOService.findByAny({
            where: {
                name: constants_1.CATEGORIES[3].name,
            },
        });
        //find garage admin role
        const role = await dao_1.default.roleDAOService.findByAny({
            where: { slug: settings_1.default.roles[4] },
        });
        if (!category)
            return Promise.reject(CustomAPIError_1.default.response(`Category does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response(`Role does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        //create partner
        const partner = await dao_1.default.partnerDAOService.create(partnerValues);
        //create default admin user
        const user = await dao_1.default.userDAOService.create(userValues);
        const contact = await dao_1.default.contactDAOService.create(contactValues);
        await user.$add('roles', [role]);
        await partner.$add('categories', [category]);
        await partner.$set('contact', contact);
        await partner.$set('users', user);
        const result = PartnerController_1.default.formatPartner(partner);
        const mailSubject = `Welcome to AutoHyve!`;
        const mailText = (0, garage_partner_welcome_email_1.default)({
            partnerName: (0, capitalize_1.default)(partnerValues.name),
            password: userValues.rawPassword,
            appUrl: process.env.CLIENT_HOST,
        });
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
            message: `Account successfully created.`,
            code: HttpStatus_1.default.OK.code,
            result,
        };
        return Promise.resolve(response);
    }
}
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "garageSignup", null);
exports.default = AuthenticationController;
