import {
  addPlanHandler,
  createPartnerHandler,
  getPartnerHandler,
  getPartnersHandler,
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
    method: "get",
    path: "/partners/:partnerId/plans",
    handler: getPlansHandler,
  },
];

export default partnerEndpoints;
