import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

import MainLayout from './components/layouts/MainLayout';
import useAppTheme from './hooks/useAppTheme';
import useAppSelector from './hooks/useAppSelector';
import AppLoader from './components/loader/AppLoader';

function App() {
  const authReducer = useAppSelector(state => state.authenticationReducer);

  const { theme } = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout />
      <AppLoader show={authReducer.signOutStatus === 'loading'} />
    </ThemeProvider>
  );
}

export default App;
