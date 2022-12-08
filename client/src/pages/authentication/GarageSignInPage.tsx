import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/layouts/PublicLayout';
import logoLogin from '../../assets/images/logoLogin.png';
import { Box, Typography } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';

import './signInForm.css';
import signInModel from '../../components/forms/models/signInModel';
import { ISignInModel } from '@app-interfaces';
import GarageSignInForm from '../../components/forms/authentication/GarageSignInForm';
import { signInAction } from '../../store/actions/authenicationActions';
import useAppDispatch from '../../hooks/useAppDispatch';
import AppAlert from '../../components/alerts/AppAlert';
import useAppSelector from '../../hooks/useAppSelector';
import AppLoader from '../../components/loader/AppLoader';
import { CustomHookMessage } from '@app-types';
import { useNavigate } from 'react-router-dom';
import cookie from '../../utils/cookie';
import settings from '../../config/settings';

const { schema, initialValues } = signInModel;

function GarageSignInPage() {
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [success, setSuccess] = useState<CustomHookMessage>();
  const [error, setError] = useState<CustomHookMessage>();

  const navigate = useNavigate();

  const authReducer = useAppSelector(state => state.authenticationReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isLoggedIn = cookie.get(settings.auth.admin);

    if (!isLoggedIn) {
      navigate('/garage/login');
    } else navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    if (authReducer.signingInStatus === 'completed') {
      setSuccess({ message: authReducer.signingInSuccess });

      setTimer(
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000),
      );
    }
  }, [authReducer.authToken, authReducer.signingInStatus, authReducer.signingInSuccess, dispatch, navigate]);

  useEffect(() => {
    if (authReducer.signingInStatus === 'failed') {
      if (authReducer.signingInError) {
        setError({ message: authReducer.signingInError });
      }
    }
  }, [authReducer.signingInStatus, authReducer.signingInError, navigate]);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);

  const handleSubmit = (values: ISignInModel, helpers: FormikHelpers<ISignInModel>) => {
    dispatch(signInAction(values));
    helpers.resetForm();
  };
  return (
    <PublicLayout>
      <img src={logoLogin} alt="" className="loginLogo" />
      <Box sx={{ mb: 3 }}>
        <Typography textAlign="center" sx={headTextStyle}>
          Sign In
        </Typography>
        <Typography textAlign="center" variant="subtitle2">
          To continue to your AutoHyve Workshop Profile
        </Typography>
      </Box>
      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
        <GarageSignInForm />
      </Formik>
      <AppAlert
        alertType="success"
        show={success !== undefined}
        message={success?.message}
        onClose={() => setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={error !== undefined}
        message={error?.message}
        onClose={() => setError(undefined)}
      />
      <AppLoader show={authReducer.signingInStatus === 'loading'} />
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

export default GarageSignInPage;
