import React from "react";
import { Navigate } from "react-router-dom";
import cookie from "../../utils/cookie";
import settings from "../../config/settings";

const cookieName = settings.auth.admin;

function PrivateRoute({ children }: any) {
  const isSignedIn = cookie.exist(cookieName) && !cookie.isExpired(cookieName);

  return isSignedIn ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
