import React from 'react';
import { Box } from '@mui/material';

interface IProps {
  bgColor?: any;
  title?: string;
  data: any;
}

export default function DataCard(props: IProps) {
  return (
    <Box
      sx={{
        bgcolor: props.bgColor,
        boxShadow: 5,
        borderRadius: 3,
        p: 2,
        minWidth: 300,
      }}>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
        }}>
        {props.title}
      </Box>
      <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>{props.data}</Box>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
          display: 'inline',
          fontSize: 12,
        }}
      />
    </Box>
  );
}
