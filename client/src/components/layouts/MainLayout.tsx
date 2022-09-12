import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "../../routes";
import PrivateRoute from "../auth/PrivateRoute";

function MainLayout() {
  return (
    <Box
      sx={{
        maxHeight: "100vh",
        height: "100%",
      }}
    >
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
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default MainLayout;