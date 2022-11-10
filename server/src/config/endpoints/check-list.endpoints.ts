import {
  createCheckListHandler,
  createJobCheckListHandler,
  deleteCheckListHandler,
  getCheckListHandler,
  getCheckListsHandler,
  updateCheckListHandler,
  updateJobCheckListHandler,
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
    method: "put",
    path: checkListIdPath,
    handler: updateCheckListHandler,
  },
  {
    name: "checkList",
    method: "patch",
    path: checkListIdPath,
    handler: updateJobCheckListHandler,
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
  {
    name: "checkList",
    method: "delete",
    path: checkListIdPath,
    handler: deleteCheckListHandler,
  },
];

export default checkListEndpoints;
