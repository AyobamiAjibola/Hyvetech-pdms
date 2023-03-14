"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoiceHandler = exports.saveInvoiceHandler = exports.getInvoicesHandler = exports.updateCompletedInvoicePaymentManuallyHandler = exports.updateCompletedInvoicePaymentHandler = exports.generateInvoiceManuallyHandler = exports.generateInvoiceHandler = exports.completeEstimateDepositHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const InvoiceController_1 = __importDefault(require("../controllers/InvoiceController"));
exports.completeEstimateDepositHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.completeEstimateDeposit(req);
    res.status(response.code).json(response);
});
exports.generateInvoiceHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.generateInvoice(req);
    res.status(response.code).json(response);
});
exports.generateInvoiceManuallyHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.generateInvoiceManually(req);
    res.status(response.code).json(response);
});
exports.updateCompletedInvoicePaymentHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.updateCompletedInvoicePayment(req);
    res.status(response.code).json(response);
});
exports.updateCompletedInvoicePaymentManuallyHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.updateCompletedInvoicePaymentManually(req);
    res.status(response.code).json(response);
});
exports.getInvoicesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.invoices(req);
    res.status(response.code).json(response);
});
exports.saveInvoiceHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.saveInvoice(req);
    res.status(response.code).json(response);
});
exports.sendInvoiceHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await InvoiceController_1.default.sendInvoice(req);
    res.status(response.code).json(response);
});
