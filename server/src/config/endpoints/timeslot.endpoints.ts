import { handleDisableTimeslots, handleGetTimeslots, handleInitTimeslots } from "../../routes/timeslotRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const path = "/timeslots";

const timeslotEndpoints: RouteEndpoints = [
  {
    name: "timeslots",
    method: "post",
    path,
    handler: handleInitTimeslots,
  },
  {
    name: "timeslots",
    method: "put",
    path,
    handler: handleDisableTimeslots,
  },
  {
    name: "timeslots",
    method: "get",
    path,
    handler: handleGetTimeslots,
  },
];

export default timeslotEndpoints;
