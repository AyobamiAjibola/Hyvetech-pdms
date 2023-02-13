"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadJobReportHandler = exports.updateJobVehicleHandler = exports.approveJobCheckListHandler = exports.cancelJobHandler = exports.reassignJobHandler = exports.assignJobHandler = exports.assignCustomerJobHandler = exports.assignDriverJobHandler = exports.getJobHandler = exports.getJobsHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const JobController_1 = __importDefault(require("../controllers/JobController"));
exports.getJobsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.jobs();
    res.status(response.code).json(response);
});
exports.getJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.job(req);
    res.status(response.code).json(response);
});
exports.assignDriverJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.assignDriverJob(req);
    res.status(response.code).json(response);
});
exports.assignCustomerJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.assignCustomerJob(req);
    res.status(response.code).json(response);
});
exports.assignJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.assignJob(req);
    res.status(response.code).json(response);
});
exports.reassignJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.reassignJob(req);
    res.status(response.code).json(response);
});
exports.cancelJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.cancelJob(req);
    res.status(response.code).json(response);
});
exports.approveJobCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.approveJobCheckList(req);
    res.status(response.code).json(response);
});
exports.updateJobVehicleHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.updateJobVehicle(req);
    res.status(response.code).json(response);
});
exports.uploadJobReportHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await JobController_1.default.uploadJobReport(req);
    res.status(response.code).json(response);
});
