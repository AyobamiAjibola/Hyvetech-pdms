import {
  createCheckListHandler,
  getCheckListHandler,
  getCheckListsHandler,
} from "../../routes/checkListRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const checkListEndpoints: RouteEndpoints = [
  {
    name: "checkList",
    method: "post",
    path: "/checkLists",
    handler: createCheckListHandler,
  },
  {
    name: "checkList",
    method: "get",
    path: "/checkLists",
    handler: getCheckListsHandler,
  },
  {
    name: "checkList",
    method: "get",
    path: "/checkLists/:checkListId",
    handler: getCheckListHandler,
  },
];

export default checkListEndpoints;
