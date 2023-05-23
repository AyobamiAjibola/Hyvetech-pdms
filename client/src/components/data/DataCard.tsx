import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';

interface IProps {
  bgColor?: any;
  title?: string;
  data: any;
  count?: any;
  toggleValue?: boolean;
}

export default function DataCard({ bgColor, title, data, count, toggleValue = false }: IProps) {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <Box
      sx={{
        bgcolor: bgColor,
        boxShadow: 5,
        borderRadius: 3,
        p: 2,
        minWidth: { md: 300, sm: 250, xs: 200 },
      }}>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
        }}>
        {title}
      </Box>
      <Box
        sx={{
          color: 'text.primary',
          fontSize: { md: 34, sm: 25, xs: 20 },
          fontWeight: 'medium',
        }}>
        {isVisible ? data : '#########'}
      </Box>
      <Box
        sx={{
          color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          fontSize: 14,
        }}>
        {count ? (count > 0 ? `Count: ${count}` : count == 0 && 'Count: 0') : ''}
      </Box>

      {toggleValue && (
        <Button
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}
          onClick={() => setIsVisible(state => !state)}>
          <Box
            sx={{
              color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#000000'),
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              fontSize: 14,
            }}>
            {isVisible ? <VisibilityOff /> : <RemoveRedEye />}
          </Box>
        </Button>
      )}
    </Box>
  );
}
