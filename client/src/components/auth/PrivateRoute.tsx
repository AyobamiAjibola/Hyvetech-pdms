import React from 'react';
import { Navigate } from 'react-router-dom';
import settings from '../../config/settings';

const admin = settings.auth.admin;

function PrivateRoute({ children }: any) {
  const isSignedIn = sessionStorage.getItem(admin);

  return isSignedIn ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
