import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import { Button, Grid, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { IComponentErrorState } from '@app-interfaces';

export default function ErrorPage() {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const state = location.state as IComponentErrorState;
      setMessage(state.errorMessage);
    }
  }, [location.state]);

  return (
    <PublicLayout>
      <Typography textAlign="center" variant="caption" gutterBottom component="div" sx={{ mt: 5 }}>
        An Error Occurred! {message}
      </Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item>
          <Button fullWidth onClick={() => navigate('/dashboard')} color="secondary" variant="contained">
            Home
          </Button>
        </Grid>
        <Grid item>
          <Button fullWidth onClick={() => navigate(-1)} color="secondary" variant="contained">
            Go Back
          </Button>
        </Grid>
      </Grid>
    </PublicLayout>
  );
}
