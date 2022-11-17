import { useMemo } from 'react';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export default function useAppTheme() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: '#1a97cf' },
          secondary: { main: '#fba91a' },
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return {
    theme: responsiveFontSizes(theme),
  };
}
