"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInTechnicianHandler = exports.getPartnerTechniciansHandler = exports.getTechniciansHandler = exports.getTechnicianHandler = exports.deleteTechnicianHandler = exports.updateTechnicianHandler = exports.createTechnicianHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const TechnicianController_1 = __importDefault(require("../controllers/TechnicianController"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const passwordEncoder = new PasswordEncoder_1.default();
const technicianController = new TechnicianController_1.default(passwordEncoder);
exports.createTechnicianHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.create(req);
    res.status(response.code).json(response);
});
exports.updateTechnicianHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.update(req);
    res.status(response.code).json(response);
});
exports.deleteTechnicianHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.delete(req);
    res.status(response.code).json(response);
});
exports.getTechnicianHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.technician(req);
    res.status(response.code).json(response);
});
exports.getTechniciansHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.technicians(req);
    res.status(response.code).json(response);
});
exports.getPartnerTechniciansHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.partnerTechnicians(req);
    res.status(response.code).json(response);
});
exports.signInTechnicianHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await technicianController.signIn(req);
    res.status(response.code).json(response);
});
