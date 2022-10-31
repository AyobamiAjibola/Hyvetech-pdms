import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import TechnicianController from "../controllers/TechnicianController";
import PasswordEncoder from "../utils/PasswordEncoder";

const passwordEncoder = new PasswordEncoder();
const technicianController = new TechnicianController(passwordEncoder);

export const createTechnicianHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.create(req);
    res.status(response.code).json(response);
  }
);

export const updateTechnicianHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.update(req);
    res.status(response.code).json(response);
  }
);

export const deleteTechnicianHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.delete(req);
    res.status(response.code).json(response);
  }
);

export const getTechnicianHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.technician(req);
    res.status(response.code).json(response);
  }
);

export const getTechniciansHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.technicians(req);
    res.status(response.code).json(response);
  }
);

export const getPartnerTechniciansHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.partnerTechnicians(req);
    res.status(response.code).json(response);
  }
);

export const signInTechnicianHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await technicianController.signIn(req);
    res.status(response.code).json(response);
  }
);
