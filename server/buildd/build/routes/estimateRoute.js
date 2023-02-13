"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimatesHandler = exports.sendDraftEstimateHandler = exports.updateEstimateHandler = exports.saveEstimateHandler = exports.deleteEstimateHandler = exports.createEstimateHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const EstimateController_1 = __importDefault(require("../controllers/EstimateController"));
const estimateController = new EstimateController_1.default();
exports.createEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.create(req);
    res.status(response.code).json(response);
});
exports.deleteEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.delete(req);
    res.status(response.code).json(response);
});
exports.saveEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.save(req);
    res.status(response.code).json(response);
});
exports.updateEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.update(req);
    res.status(response.code).json(response);
});
exports.sendDraftEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.sendDraft(req);
    res.status(response.code).json(response);
});
exports.getEstimatesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await estimateController.estimates(req);
    res.status(response.code).json(response);
});
