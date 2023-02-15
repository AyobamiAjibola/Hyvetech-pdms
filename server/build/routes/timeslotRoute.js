"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTimeslots = exports.handleDisableTimeslots = exports.handleInitTimeslots = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const TimeSlotController_1 = __importDefault(require("../controllers/TimeSlotController"));
exports.handleInitTimeslots = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await TimeSlotController_1.default.initTimeSlot(req);
    res.status(result.code).json(result);
});
exports.handleDisableTimeslots = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await TimeSlotController_1.default.disableTimeslot(req);
    res.status(result.code).json(result);
});
exports.handleGetTimeslots = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await TimeSlotController_1.default.getDefaultTimeslots();
    res.status(result.code).json(result);
});
