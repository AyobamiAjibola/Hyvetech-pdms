import React from 'react';
import { Box } from '@mui/material';

import AppRoutes from '../../routes/AppRoutes';

function MainLayout() {
  return (
    <Box
      sx={{
        maxHeight: '100vh',
        height: '100%',
      }}>
      <AppRoutes />
    </Box>
  );
}

export default MainLayout;
