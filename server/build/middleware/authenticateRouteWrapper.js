"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const settings_1 = __importDefault(require("../config/settings"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const Role_1 = __importDefault(require("../models/Role"));
const Partner_1 = __importDefault(require("../models/Partner"));
const TechnicianRepository_1 = __importDefault(require("../repositories/TechnicianRepository"));
const CustomerRepository_1 = __importDefault(require("../repositories/CustomerRepository"));
const RideShareDriverRepository_1 = __importDefault(require("../repositories/RideShareDriverRepository"));
const cookieParser = require("cookie-parser");
const logger = AppLogger_1.default.init(authenticateRouteWrapper.name).logger;
const userRepository = new UserRepository_1.default();
const technicianRepository = new TechnicianRepository_1.default();
const customerRepository = new CustomerRepository_1.default();
const rideShareDriverRepository = new RideShareDriverRepository_1.default();
function authenticateRouteWrapper(handler) {
    return async function (req, res, next) {
        const headers = req.headers;
        // console.log(req)
        const authorization = headers.authorization;
        const cookies = req.signedCookies;
        const key = settings_1.default.jwt.key;
        const cookieName = settings_1.default.cookie.name;
        const cookie = cookies[cookieName];
        if (cookie) {
            const jwt = cookieParser.signedCookie(cookie, settings_1.default.cookie.secret);
            if (false === jwt) {
                logger.error(`malformed authorization: invalid cookie`);
                return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            }
            const payload = (0, jsonwebtoken_1.verify)(jwt, key);
            req.permissions = payload.permissions;
            req.jwt = jwt;
            if (payload.rideShareDriverId) {
                const { rideShareDriverId } = payload;
                const rideShareDriver = await rideShareDriverRepository.findById(rideShareDriverId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (rideShareDriver)
                    return await handler(req, res, next);
            }
            if (payload.userId) {
                const { userId } = payload;
                const user = await userRepository.findById(userId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (user) {
                    req.user = user;
                    return await handler(req, res, next);
                }
                const technician = await technicianRepository.findById(userId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (technician)
                    return await handler(req, res, next);
                const customer = await customerRepository.findById(userId, {
                    include: [Role_1.default],
                });
                if (customer)
                    return await handler(req, res, next);
            }
        }
        if (authorization) {
            if (!authorization.startsWith('Bearer')) {
                logger.error(`malformed authorization: 'Bearer' missing`);
                return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            }
            const jwt = authorization.split(' ')[1].trim();
            const payload = (0, jsonwebtoken_1.verify)(jwt, key);
            req.permissions = payload.permissions;
            req.jwt = jwt;
            if (payload.rideShareDriverId) {
                const { rideShareDriverId } = payload;
                const rideShareDriver = await rideShareDriverRepository.findById(rideShareDriverId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (rideShareDriver)
                    return await handler(req, res, next);
            }
            if (payload.userId) {
                const { userId } = payload;
                const user = await userRepository.findById(userId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (user) {
                    req.user = user;
                    return await handler(req, res, next);
                }
                const technician = await technicianRepository.findById(userId, {
                    include: [Role_1.default, Partner_1.default],
                });
                if (technician)
                    return await handler(req, res, next);
                const customer = await customerRepository.findById(userId, {
                    include: [Role_1.default],
                });
                if (customer)
                    return await handler(req, res, next);
            }
        }
        return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
    };
}
exports.default = authenticateRouteWrapper;
