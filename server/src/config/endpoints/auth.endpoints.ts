import { signInHandler, signupHandler } from "../../routes/authRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const authEndpoints: RouteEndpoints = [
  {
    name: "signIn",
    method: "post",
    path: "/sign-in",
    handler: signInHandler,
  },
  {
    name: "signUp",
    method: "post",
    path: "/sign-up",
    handler: signupHandler,
  },
];

export default authEndpoints;
