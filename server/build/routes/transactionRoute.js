"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionHandler = exports.initTransactionCallbackHandler = exports.verifyRefundCustomerHandler = exports.initRefundCustomerHandler = exports.depositForEstimateHandler = exports.txnStatusHandler = void 0;
const TransactionController_1 = __importDefault(require("../controllers/TransactionController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const txnStatusHandler = async (req, res) => {
    await TransactionController_1.default.subscriptionsTransactionStatus(req);
};
exports.txnStatusHandler = txnStatusHandler;
exports.depositForEstimateHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await TransactionController_1.default.depositForEstimate(req);
    res.status(response.code).json(response);
});
exports.initRefundCustomerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await TransactionController_1.default.initRefundCustomer(req);
    res.status(response.code).json(response);
});
exports.verifyRefundCustomerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await TransactionController_1.default.verifyRefundCustomer(req);
    res.status(response.code).json(response);
});
const initTransactionCallbackHandler = async (req, res) => {
    const response = await TransactionController_1.default.initTransactionCallback(req);
    res.status(response.code).json(response);
};
exports.initTransactionCallbackHandler = initTransactionCallbackHandler;
exports.updateTransactionHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await TransactionController_1.default.updateTransaction(req);
    res.status(response.code).json(response);
});
