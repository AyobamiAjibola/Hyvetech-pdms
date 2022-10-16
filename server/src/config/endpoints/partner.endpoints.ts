import {
  addPaymentPlanHandler,
  addPlanHandler,
  createPartnerHandler,
  createPartnerKycHandler,
  createPartnerSettingsHandler,
  deletePaymentPlanHandler,
  deletePlanHandler,
  driversFilterDataHandler,
  filterDriversHandler,
  getPartnerHandler,
  getPartnersHandler,
  getPaymentPlansHandler,
  getPlansHandler,
  partnerJobsHandler,
} from "../../routes/partnerHandler";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const partnerEndpoints: RouteEndpoints = [
  {
    name: "partners",
    method: "post",
    path: "/partners",
    handler: createPartnerHandler,
  },
  {
    name: "partners",
    method: "patch",
    path: "/partners/:partnerId/kyc",
    handler: createPartnerKycHandler,
  },
  {
    name: "partners",
    method: "patch",
    path: "/partners/:partnerId/settings",
    handler: createPartnerSettingsHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners",
    handler: getPartnersHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId",
    handler: getPartnerHandler,
  },
  {
    name: "partners",
    method: "post",
    path: "/partners/:partnerId/plans",
    handler: addPlanHandler,
  },
  {
    name: "partners",
    method: "post",
    path: "/partners/:partnerId/payment-plans",
    handler: addPaymentPlanHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId/payment-plans",
    handler: getPaymentPlansHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId/plans",
    handler: getPlansHandler,
  },
  {
    name: "partners",
    method: "post",
    path: "/partners/:partnerId/filter-drivers",
    handler: filterDriversHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId/drivers-filter-data",
    handler: driversFilterDataHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId/owners-filter-data",
    handler: driversFilterDataHandler,
  },
  {
    name: "partners",
    method: "get",
    path: "/partners/:partnerId/jobs",
    handler: partnerJobsHandler,
  },

  {
    name: "delete plan",
    method: "delete",
    path: "/partners",
    handler: deletePlanHandler,
  },

  {
    name: "delete payment plan",
    method: "delete",
    path: "/partners",
    handler: deletePaymentPlanHandler,
  },
];

export default partnerEndpoints;
