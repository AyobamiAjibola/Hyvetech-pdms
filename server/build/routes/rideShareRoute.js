"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRideShareDriverHandler = exports.getRideShareDriverTransactionsHandler = exports.getRideShareDriverAppointmentsHandler = exports.getRideShareDriverVehiclesHandler = exports.getRideShareDriverHandler = exports.getRideShareDriversHandler = exports.getDriverHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const RideShareDriverController_1 = __importDefault(require("../controllers/RideShareDriverController"));
exports.getDriverHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const driverId = req.params.driverId;
    const response = await RideShareDriverController_1.default.driver(+driverId);
    res.status(response.code).json(response);
});
exports.getRideShareDriversHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await RideShareDriverController_1.default.allRideShareDrivers();
    res.status(response.code).json(response);
});
exports.getRideShareDriverHandler = exports.getDriverHandler;
exports.getRideShareDriverVehiclesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await RideShareDriverController_1.default.driverVehicles(req);
    res.status(response.code).json(response);
});
exports.getRideShareDriverAppointmentsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await RideShareDriverController_1.default.driverAppointments(req);
    res.status(response.code).json(response);
});
exports.getRideShareDriverTransactionsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await RideShareDriverController_1.default.driverTransactions(req);
    res.status(response.code).json(response);
});
exports.deleteRideShareDriverHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await RideShareDriverController_1.default.deleteDriver(req);
    res.status(response.code).json(response);
});
