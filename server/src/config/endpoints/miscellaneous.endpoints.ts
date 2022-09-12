import { statesAndDistrictsHandler } from "../../routes/miscellaneousHandler";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const miscellaneousEndpoints: RouteEndpoints = [
  {
    name: "states and districts",
    method: "get",
    path: "/states",
    handler: statesAndDistrictsHandler,
  },
];

export default miscellaneousEndpoints;
