"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payStackBanksHandler = exports.statesAndDistrictsHandler = void 0;
const MiscellaneousController_1 = __importDefault(require("../controllers/MiscellaneousController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
exports.statesAndDistrictsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await MiscellaneousController_1.default.getStatesAndDistricts();
    res.status(result.code).json(result);
});
exports.payStackBanksHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await MiscellaneousController_1.default.getPayStackBanks(req);
    res.status(result.code).json(result);
});
