import './publicLayout.css';

import { Box, Paper, Theme } from '@mui/material';
import React from 'react';

import cover from '../../assets/images/cover.png';
import mechanic from '../../assets/images/mechanic.jpg';

export default function PublicLayout({ children }: any) {
  const date = new Date().getFullYear();
  return (
    <Box sx={mainContainerStyle}>
      <span className="rightReserved">© {date} All Rights Reserved, Jiffix Technologies Limited.</span>
      <a href="https://www.jiffixtech.com/" className="aboutUs">
        About Us
      </a>
      <img src={cover} alt="" className="leftLoginBackgroundImage" />

      <Paper elevation={8} sx={childrenWrapperStyle}>
        {children}
      </Paper>
    </Box>
  );
}

const mainContainerStyle = {
  height: '100vh',
  width: '100vw',
  backgroundImage: {sm: `url(${mechanic})`, xs: 'none'},
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  display: 'flex',
  justifyContent: ' center',
  alignItems: 'center',
};

const childrenWrapperStyle = {
  width: {md: '40%', sm: '70%', xs: '90%'},
  maxHeight: "90%",
  overflow: "hidden",
  overflowY: "scroll",
  position: 'relative',
  right: '23%',
  left: '0',
  zIndex: 1000,
  pl: {sm: '60px', xs: '10px'},
  pr: {sm: '60px', xs: '10px'},
  pt: '20px',
  pb: '50px',
  background: (theme: Theme) => (theme.palette.mode === 'dark' ? 'paper.default' : '#FFFFFF'),
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5) !important',
  borderRadius: '10px !important',
};
