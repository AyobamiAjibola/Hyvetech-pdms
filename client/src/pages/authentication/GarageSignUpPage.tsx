import React, { useEffect, useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import PublicLayout from '../../components/layouts/PublicLayout';
import logoLogin from '../../assets/images/logoLogin.png';
import { Box, Typography } from '@mui/material';

import './signInForm.css';
import GarageSignUpForm from '../../components/forms/authentication/GarageSignUpForm';
import garageSignUpModel, { IGarageSignupModel } from '../../components/forms/models/garageSignUpModel';
import useAppSelector from '../../hooks/useAppSelector';
import { CustomHookMessage } from '@app-types';
import AppLoader from '../../components/loader/AppLoader';
import AppAlert from '../../components/alerts/AppAlert';
import useAppDispatch from '../../hooks/useAppDispatch';
import { garageSignUpAction } from '../../store/actions/authenicationActions';

const { schema, initialValues } = garageSignUpModel;

function GarageSignUpPage() {
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const authenticationReducer = useAppSelector(state => state.authenticationReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authenticationReducer.garageSignUpStatus === 'failed') {
      setError({ message: authenticationReducer.garageSignUpError });
    }
  }, [authenticationReducer.garageSignUpError, authenticationReducer.garageSignUpStatus]);

  useEffect(() => {
    if (authenticationReducer.garageSignUpStatus === 'completed') {
      setSuccess({ message: authenticationReducer.garageSignUpSuccess });
    }
  }, [authenticationReducer.garageSignUpSuccess, authenticationReducer.garageSignUpStatus]);

  const handleSubmit = (values: IGarageSignupModel, helpers: FormikHelpers<IGarageSignupModel>) => {
    void dispatch(garageSignUpAction(values));
    helpers.resetForm();
  };
  return (
    <PublicLayout>
      <img src={logoLogin} alt="" className="loginLogo" />
      <Box sx={{ mb: 3 }}>
        <Typography textAlign="center" sx={headTextStyle}>
          Create your AutoHyve Account
        </Typography>
        <Typography textAlign="center" variant="subtitle2">
          To continue to your AutoHyve Workshop Profile
        </Typography>
      </Box>
      <Formik validationSchema={schema} initialValues={initialValues} onSubmit={handleSubmit}>
        <GarageSignUpForm />
      </Formik>
      <AppAlert
        alertType="error"
        show={error !== undefined}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      <AppAlert
        alertType="success"
        show={success !== undefined}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppLoader show={authenticationReducer.garageSignUpStatus === 'loading'} />
    </PublicLayout>
  );
}

const headTextStyle = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '20px',
  mb: '10px',
};

export default GarageSignUpPage;
