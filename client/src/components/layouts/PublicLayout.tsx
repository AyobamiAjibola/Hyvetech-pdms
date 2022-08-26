import React from "react";
import { Box, Paper } from "@mui/material";

function PublicLayout({ children }: any) {
  return (
    <Box
      sx={{
        width: "60ch",
        m: "auto",
        my: "30vh",
      }}
    >
      <Paper elevation={8} sx={{ p: 3 }}>
        {children}
      </Paper>
    </Box>
  );
}

export default PublicLayout;
