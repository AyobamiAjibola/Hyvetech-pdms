"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestWorkshopHandler = exports.getCustomerTransactionsHandler = exports.getCustomerAppointmentsHandler = exports.getCustomerVehiclesHandler = exports.getCustomerHandler = exports.getCustomersHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const CustomerController_1 = __importDefault(require("../controllers/CustomerController"));
exports.getCustomersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CustomerController_1.default.allCustomers();
    res.status(response.code).json(response);
});
exports.getCustomerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const customerId = req.params.customerId;
    const response = await CustomerController_1.default.customer(+customerId);
    res.status(response.code).json(response);
});
exports.getCustomerVehiclesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CustomerController_1.default.customerVehicles(req);
    res.status(response.code).json(response);
});
exports.getCustomerAppointmentsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CustomerController_1.default.customerAppointments(req);
    res.status(response.code).json(response);
});
exports.getCustomerTransactionsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CustomerController_1.default.customerTransactions(req);
    res.status(response.code).json(response);
});
exports.suggestWorkshopHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CustomerController_1.default.suggestWorkshop(req);
    res.status(response.code).json(response);
});
