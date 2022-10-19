import React from "react";
import { Box, Paper } from "@mui/material";
import './publicLayout.css'
import cover from '../../assets/images/cover.png'
function PublicLayout({ children }: any) {
  return (
    <Box className="loginBackgroundImage">
      <img src={cover} alt="" className="leftLoginBackgroundImage" />
      <Paper elevation={8} className="formContainerWidth" >
        {children}
      </Paper>
    </Box>
  );
}

export default PublicLayout;
