"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardHandler = void 0;
const DashboardController_1 = __importDefault(require("../controllers/DashboardController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
exports.dashboardHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await DashboardController_1.default.getData();
    res.status(result.code).json(result);
});
