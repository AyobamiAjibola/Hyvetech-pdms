"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointmentHandler = exports.rescheduleAppointmentHandler = exports.updateAppointmentHandler = exports.createAppointmentHandler = exports.getAppointmentHandler = exports.getAppointmentsHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const AppointmentController_1 = __importDefault(require("../controllers/AppointmentController"));
exports.getAppointmentsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.allAppointments();
    res.status(response.code).json(response);
});
exports.getAppointmentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.getAppointment(req);
    res.status(response.code).json(response);
});
exports.createAppointmentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.createAppointment(req);
    res.status(response.code).json(response);
});
exports.updateAppointmentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.updateAppointment(req);
    res.status(response.code).json(response);
});
exports.rescheduleAppointmentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.rescheduleInspection(req);
    res.status(response.code).json(response);
});
exports.cancelAppointmentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await AppointmentController_1.default.cancelInspection(req);
    res.status(response.code).json(response);
});
