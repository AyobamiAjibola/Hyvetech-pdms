import {
  bootstrapHandler,
  garageSignUpHandler,
  sendPasswordResetToken,
  signInHandler,
  signOutHandler,
  signupHandler,
} from "../../routes/authRoute";
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
  {
    name: "Garage signUp",
    method: "post",
    path: "/garage-sign-up",
    handler: garageSignUpHandler,
  },
  // {
  //   name: "Reset Password",
  //   method: "post",
  //   path: "/send-password-reset-token",
  //   handler: sendPasswordResetToken,
  // },
  {
    name: "signOut",
    method: "get",
    path: "/sign-out",
    handler: signOutHandler,
  },
  {
    name: "bootstrap",
    method: "get",
    path: "/bootstrap",
    handler: bootstrapHandler,
  },
];

export default authEndpoints;
