import { getUserHandler, getUsersHandler } from "../../routes/userRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const userEndpoints: RouteEndpoints = [
  {
    name: "users",
    method: "get",
    path: "/users",
    handler: getUsersHandler,
  },
  {
    name: "users",
    method: "get",
    path: "/users/:userId",
    handler: getUserHandler,
  },
];

export default userEndpoints;
