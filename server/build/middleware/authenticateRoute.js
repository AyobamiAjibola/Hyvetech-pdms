"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const settings_1 = __importDefault(require("../config/settings"));
const jsonwebtoken_1 = require("jsonwebtoken");
const authorizeRoute_1 = __importDefault(require("./authorizeRoute"));
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const CustomerRepository_1 = __importDefault(require("../repositories/CustomerRepository"));
const logger = AppLogger_1.default.init(authenticateRoute.name).logger;
const userRepo = new UserRepository_1.default();
const customerRepo = new CustomerRepository_1.default();
async function authenticateRoute(req, res, next) {
    const headers = req.headers;
    const cookie = headers.cookie;
    const authorization = headers.authorization;
    let jwt = '';
    if (cookie) {
        const [name, token] = cookie.split('=');
        if (!name.startsWith('_admin_auth')) {
            logger.error("malformed authorization: '_admin_auth' missing");
            return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        }
        jwt = token.trim();
    }
    else if (authorization) {
        const [name, token] = authorization.split(' ');
        if (!name.startsWith('Bearer')) {
            logger.error('malformed token: no Bearer in header');
            return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        }
        jwt = token.trim();
    }
    else {
        logger.error('Cookie or Authorization not in header');
        return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
    }
    const key = settings_1.default.jwt.key;
    const payload = (0, jsonwebtoken_1.verify)(jwt, key);
    if (payload.userId) {
        const user = await userRepo.findById(payload.userId);
        if (!user) {
            return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        }
    }
    if (payload.customer) {
        const customer = await customerRepo.findById(payload.customer);
        if (!customer) {
            return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        }
    }
    req.permissions = payload.permissions;
    const authorised = await (0, authorizeRoute_1.default)(req);
    if (!authorised)
        return next(CustomAPIError_1.default.response(HttpStatus_1.default.FORBIDDEN.value, HttpStatus_1.default.FORBIDDEN.code));
    next();
}
exports.default = authenticateRoute;
