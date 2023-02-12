"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicleVIN = exports.getVehicleSubscriptions = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const VehicleController_1 = __importDefault(require("../controllers/VehicleController"));
exports.getVehicleSubscriptions = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await VehicleController_1.default.vehicleSubscriptions(req);
    res.status(response.code).json(response);
});
exports.getVehicleVIN = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await VehicleController_1.default.getVIN(req);
    res.status(response.code).json(response);
});
