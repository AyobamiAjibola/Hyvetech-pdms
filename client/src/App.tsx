import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import './App.css';

import MainLayout from './components/layouts/MainLayout';
import useAppTheme from './hooks/useAppTheme';
import useAppSelector from './hooks/useAppSelector';
import AppLoader from './components/loader/AppLoader';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';

function App() {
  const authReducer = useAppSelector(state => state.authenticationReducer);

  const { theme } = useAppTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainLayout />
        <AppLoader show={authReducer.signOutStatus === 'loading'} />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
