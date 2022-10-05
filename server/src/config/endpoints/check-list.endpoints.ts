import { createCheckListHandler } from "../../routes/checkListRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const checkListEndpoints: RouteEndpoints = [
  {
    name: "checkList",
    method: "post",
    path: "/checkLists",
    handler: createCheckListHandler,
  },
];

export default checkListEndpoints;
