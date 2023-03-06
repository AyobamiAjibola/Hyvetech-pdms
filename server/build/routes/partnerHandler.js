"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPdfHandler = exports.deletePlanHandler = exports.partnerJobsHandler = exports.driversFilterDataHandler = exports.filterDriversHandler = exports.getPaymentPlansHandler = exports.getPlansHandler = exports.addPaymentPlanHandler = exports.addPlanHandler = exports.getPartnerHandler = exports.getPartnersHandler = exports.createPartnerSettingsHandler = exports.createPartnerKycHandler = exports.togglePartnerHandler = exports.deletePartnerHandler = exports.createPartnerHandler = void 0;
const PartnerController_1 = __importDefault(require("../controllers/PartnerController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const passwordEncoder = new PasswordEncoder_1.default();
const partnerController = new PartnerController_1.default(passwordEncoder);
exports.createPartnerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.createPartner(req);
    res.status(result.code).json(result);
});
exports.deletePartnerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.deletePartner(req);
    res.status(result.code).json(result);
});
exports.togglePartnerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.togglePartner(req);
    res.status(result.code).json(result);
});
exports.createPartnerKycHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.createKyc(req);
    res.status(result.code).json(result);
});
exports.createPartnerSettingsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.createSettings(req);
    res.status(result.code).json(result);
});
exports.getPartnersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.getPartners();
    res.status(result.code).json(result);
});
exports.getPartnerHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const id = req.params.partnerId;
    const result = await partnerController.getPartner(+id);
    res.status(result.code).json(result);
});
exports.addPlanHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const partnerId = req.params.partnerId;
    const body = req.body;
    const result = await partnerController.addPlan(body, +partnerId);
    res.status(result.code).json(result);
});
exports.addPaymentPlanHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const partnerId = req.params.partnerId;
    const body = req.body;
    const result = await partnerController.addPaymentPlan(body, +partnerId);
    res.status(result.code).json(result);
});
exports.getPlansHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const partnerId = req.params.partnerId;
    const result = await partnerController.getPlans(+partnerId);
    res.status(result.code).json(result);
});
exports.getPaymentPlansHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const partnerId = req.params.partnerId;
    const result = await partnerController.getPaymentPlans(+partnerId);
    res.status(result.code).json(result);
});
exports.filterDriversHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.filterDrivers(req);
    res.status(result.code).json(result);
});
exports.driversFilterDataHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.driversFilterData(req);
    res.status(result.code).json(result);
});
exports.partnerJobsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.jobs(req);
    res.status(result.code).json(result);
});
exports.deletePlanHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.deletePlan(req);
    res.status(result.code).json(result);
});
exports.requestPdfHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const result = await partnerController.requestPdf(req);
    // @ts-ignore
    res.status(result.code).json(result);
});
