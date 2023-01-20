"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersHandler = exports.getUserHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
exports.getUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await UserController_1.default.user(req);
    res.status(response.code).json(response);
});
exports.getUsersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await UserController_1.default.users();
    res.status(response.code).json(response);
});
