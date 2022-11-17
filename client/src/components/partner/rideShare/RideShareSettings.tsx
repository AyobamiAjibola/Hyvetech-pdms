import React from 'react';
import { Box } from '@mui/material';
import { Formik } from 'formik';
import RideShareSettingsForm from '../../forms/partner/RideShareSettingsForm';
import rideShareSettingsModel from '../../forms/models/rideShareSettingsModel';

function RideShareSettings() {
  const handleSubmit = () => {
    //
  };

  return (
    <Box>
      <Formik
        validationSchema={rideShareSettingsModel.schema}
        initialValues={rideShareSettingsModel.initialValues}
        onSubmit={handleSubmit}>
        <RideShareSettingsForm />
      </Formik>
    </Box>
  );
}

export default RideShareSettings;
