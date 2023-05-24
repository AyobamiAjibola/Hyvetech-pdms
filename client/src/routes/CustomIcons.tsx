import React from 'react';
import HyvePayIcon from '../assets/images/hyvepay3.svg';
// import HyvePayIconBlack from '../assets/images/hyvepay-black.svg';
import { Icon } from '@mui/material';
import useAppTheme from '../hooks/useAppTheme';

export const HyvePayIconWrapper = (props: any) => {
  const isDarkMode = useAppTheme();
  return (
    <Icon {...props}>
      <img
        src={isDarkMode.theme.palette.mode === 'dark' ? HyvePayIcon : HyvePayIcon}
        style={{ width: 25, height: 25 }}
        alt="hyvepay"
      />
    </Icon>
  );
};
