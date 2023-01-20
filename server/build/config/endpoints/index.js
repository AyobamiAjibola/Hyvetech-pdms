"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_endpoints_1 = __importDefault(require("./auth.endpoints"));
const appointment_endpoints_1 = __importDefault(require("./appointment.endpoints"));
const customer_endpoints_1 = __importDefault(require("./customer.endpoints"));
const dashboard_endpoints_1 = __importDefault(require("./dashboard.endpoints"));
const timeslot_endpoints_1 = __importDefault(require("./timeslot.endpoints"));
const miscellaneous_endpoints_1 = __importDefault(require("./miscellaneous.endpoints"));
const partner_endpoints_1 = __importDefault(require("./partner.endpoints"));
const ride_share_endpoints_1 = __importDefault(require("./ride-share.endpoints"));
const vehicle_endpoints_1 = __importDefault(require("./vehicle.endpoints"));
const technician_endpoints_1 = __importDefault(require("./technician.endpoints"));
const job_endpoints_1 = __importDefault(require("./job.endpoints"));
const user_endpoints_1 = __importDefault(require("./user.endpoints"));
const check_list_endpoints_1 = __importDefault(require("./check-list.endpoints"));
const transaction_endpoints_1 = __importDefault(require("./transaction.endpoints"));
const estimate_endpoints_1 = __importDefault(require("./estimate.endpoints"));
const invoice_endpoints_1 = __importDefault(require("./invoice.endpoints"));
const endpoints = auth_endpoints_1.default
    .concat(appointment_endpoints_1.default)
    .concat(customer_endpoints_1.default)
    .concat(dashboard_endpoints_1.default)
    .concat(miscellaneous_endpoints_1.default)
    .concat(partner_endpoints_1.default)
    .concat(timeslot_endpoints_1.default)
    .concat(ride_share_endpoints_1.default)
    .concat(vehicle_endpoints_1.default)
    .concat(technician_endpoints_1.default)
    .concat(job_endpoints_1.default)
    .concat(user_endpoints_1.default)
    .concat(check_list_endpoints_1.default)
    .concat(transaction_endpoints_1.default)
    .concat(estimate_endpoints_1.default)
    .concat(invoice_endpoints_1.default);
exports.default = endpoints;
