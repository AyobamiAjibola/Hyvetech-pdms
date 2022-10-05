import {
  assignCustomerJobHandler,
  assignDriverJobHandler,
  getJobsHandler,
} from "../../routes/jobRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const jobEndpoints: RouteEndpoints = [
  {
    name: "jobs",
    method: "get",
    path: "/jobs",
    handler: getJobsHandler,
  },
  {
    name: "jobs",
    method: "post",
    path: "/jobs/:partnerId/driver-assign",
    handler: assignDriverJobHandler,
  },
  {
    name: "jobs",
    method: "post",
    path: "/jobs/:partnerId/customer-assign",
    handler: assignCustomerJobHandler,
  },
];

export default jobEndpoints;
