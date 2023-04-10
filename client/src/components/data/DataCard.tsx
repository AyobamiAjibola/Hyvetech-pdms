import React from 'react';
import { Box } from '@mui/material';

interface IProps {
  bgColor?: any;
  title?: string;
  data: any;
  count?: any;
}

export default function DataCard(props: IProps) {
  return (
    <Box
      sx={{
        bgcolor: props.bgColor,
        boxShadow: 5,
        borderRadius: 3,
        p: 2,
        minWidth: {md: 300, sm: 250, xs: 200 }
      }}>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
        }}>
        {props.title}
      </Box>
      <Box
        sx={{
          color: 'text.primary',
          fontSize: { md: 34, sm: 25, xs: 20 },
          fontWeight: 'medium'
        }}
      >{props.data}</Box>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
          display: 'flex',
          justifyContent: 'flex-end', alignItems: 'flex-end',
          fontSize: 14,
        }}
      >
        {props.count || props.count === 0 && `Count: ${props.count}`}
      </Box>

    </Box>
  );
}
