"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = __importDefault(require("../services/dao"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const Partner_1 = __importDefault(require("../models/Partner"));
class UserController {
    static async user(req) {
        const userId = req.params.userId;
        try {
            const user = await dao_1.default.userDAOService.findById(+userId, {
                include: [Partner_1.default],
            });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response(`User with Id: ${userId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                result: user,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async users() {
        try {
            const users = await dao_1.default.userDAOService.findAll({
                include: [{ all: true }],
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: users,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = UserController;
