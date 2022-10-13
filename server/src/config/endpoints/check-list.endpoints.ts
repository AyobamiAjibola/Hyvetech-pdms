import {
  createCheckListHandler,
  createJobCheckListHandler,
  getCheckListHandler,
  getCheckListsHandler,
  updateCheckListHandler,
} from "../../routes/checkListRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const checkListIdPath = "/checkLists/:checkListId";
const checkListEndpoints: RouteEndpoints = [
  {
    name: "checkList",
    method: "post",
    path: "/checkLists",
    handler: createCheckListHandler,
  },
  {
    name: "checkList",
    method: "patch",
    path: checkListIdPath,
    handler: updateCheckListHandler,
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
    path: checkListIdPath,
    handler: getCheckListHandler,
  },
  {
    name: "checkList",
    method: "post",
    path: "/checkLists/:jobId",
    handler: createJobCheckListHandler,
  },
];

export default checkListEndpoints;
