import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./index";
import PrivateRoute from "../components/auth/PrivateRoute";
import ErrorPage from "../pages/error/ErrorPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          if (route.isPublic) {
            return (
              <Route
                key={index}
                path={route.path}
                element={<route.Element />}
              />
            );
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.Element />
                </PrivateRoute>
              }
            />
          );
        })}
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
