import {
  bootstrapHandler,
  changePasswordHandler,
  checkAuthHandler,
  garageSignUpHandler,
  preSignUpHandler,
  resetPasswordWithToken,
  resetToken,
  sendPasswordResetToken,
  signInHandler,
  signOutHandler,
  signupHandler,
  verifyTokenHandler,
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
    name: "check auth",
    method: "get",
    path: "/check-auth",
    handler: checkAuthHandler,
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
  {
    name: "Reset Password",
    method: "post",
    path: "/send-password-reset-token",
    handler: sendPasswordResetToken,
  },
  {
    name: "Enter Password After Reset",
    method: "put",
    path: "/reset-password-with-token",
    handler: resetPasswordWithToken,
  },
  {
    name: "Enter Reset Token",
    method: "put",
    path: "/reset-token",
    handler: resetToken,
  },
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
  {
    name: "change password",
    method: "put",
    path: "/change/password",
    handler: changePasswordHandler,
  },
  {
    name: "pre sign up",
    method: "post",
    path: "/pre-sign-up",
    handler: preSignUpHandler,
  },
  {
    name: "verify token",
    method: "post",
    path: "/verify-token",
    handler: verifyTokenHandler,
  },
];

export default authEndpoints;
