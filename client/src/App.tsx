import React from "react";
import { ThemeProvider } from "@mui/material";

import useAppTheme from "./hooks/useAppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./components/layouts/MainLayout";

function App() {
  const { theme } = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
