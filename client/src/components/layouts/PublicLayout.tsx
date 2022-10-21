import React from "react";
import { Box, Paper } from "@mui/material";
import "./publicLayout.css";
import cover from "../../assets/images/cover.png";
import mechanic from "../../assets/images/mechanic.jpg";

export default function PublicLayout({ children }: any) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100% !important",
        backgroundImage: `url(${mechanic})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        display: "flex",
        justifyContent: " center",
        alignItems: "center",
        // position: 'relative'
      }}
    >

      <span className="rightReserved">© 2022 All Rights Reserved, Jiffix Technologies Limited.</span>
      <a href="https://www.jiffixtech.com/" className="aboutUs">About Us</a>
      <img src={cover} alt="" className="leftLoginBackgroundImage" />

      <Paper
        elevation={8}
        sx={{
          width: "40%",
          position: "relative",
          right: "23%",
          left: '0',
          zIndex: 1000,
          pl: "60px",
          pr: "60px",
          pt: "20px",
          pb: "50px",
          background: (theme) =>
            theme.palette.mode === "dark" ? "paper.default" : "#FFFFFF",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5) !important",
          borderRadius: "10px !important",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
