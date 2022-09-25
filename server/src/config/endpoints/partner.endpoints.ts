import {
  addPaymentPlanHandler,
  addPlanHandler,
  createPartnerHandler,
  driversFilterDataHandler,
  filterDriversHandler,
  getPartnerHandler,
  getPartnersHandler,
  getPaymentPlansHandler,
  getPlansHandler,
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
];

export default partnerEndpoints;
