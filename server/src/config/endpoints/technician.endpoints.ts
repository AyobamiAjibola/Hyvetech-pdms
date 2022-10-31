import {
  createTechnicianHandler,
  deleteTechnicianHandler,
  getPartnerTechniciansHandler,
  getTechnicianHandler,
  getTechniciansHandler,
  signInTechnicianHandler,
  updateTechnicianHandler,
} from "../../routes/technicianRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const getPath = "/technicians/:techId";

const technicianEndpoints: RouteEndpoints = [
  {
    name: "create technician",
    method: "post",
    path: "/technicians",
    handler: createTechnicianHandler,
  },
  {
    name: "update technician",
    method: "patch",
    path: getPath,
    handler: updateTechnicianHandler,
  },

  {
    name: "delete technician",
    method: "delete",
    path: getPath,
    handler: deleteTechnicianHandler,
  },

  {
    name: "get technician",
    method: "get",
    path: getPath,
    handler: getTechnicianHandler,
  },

  {
    name: "get technicians",
    method: "get",
    path: "/technicians",
    handler: getTechniciansHandler,
  },
  {
    name: "get partner technicians",
    method: "get",
    path: "/technicians/:partnerId/partner",
    handler: getPartnerTechniciansHandler,
  },

  {
    name: "sign in technician",
    method: "post",
    path: "/technicians/sign-in",
    handler: signInTechnicianHandler,
  },
];

export default technicianEndpoints;
