import './signInForm.css';
import { ISignInModel } from '@app-interfaces';
import { Box, Typography } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import logoLogin from '../../assets/images/logoLogin.png';
import AppAlert from '../../components/alerts/AppAlert';
import SignInForm from '../../components/forms/authentication/SignInForm';
import signInModel from '../../components/forms/models/signInModel';
import PublicLayout from '../../components/layouts/PublicLayout';
import withErrorBoundary from '../../hoc/withErrorBoundary';
import useAppDispatch from '../../hooks/useAppDispatch';
import useLogin from '../../hooks/useLogin';
import { signInAction } from '../../store/actions/authenicationActions';

function SignInPageAdmin() {
  const dispatch = useAppDispatch();

  const login = useLogin();

  const handleSignIn = (values: ISignInModel, formikHelpers: FormikHelpers<ISignInModel>) => {

    dispatch(signInAction(values));
    formikHelpers.resetForm();
  };

  return (
    <PublicLayout>
      <img src={logoLogin} alt="" className="loginLogo" />
      {/* <Typography textAlign="center" sx={headTextStyle}>
        Welcome to your gateway to boundless opportunities!
      </Typography> */}
      <Box sx={{ mb: 3 }}>
        <Typography textAlign="center" sx={{fontWeight: 500, fontSize: {xs: 20, sm: 25}, mb: 2}}>
          Sign In
        </Typography>
        <Typography textAlign="center" sx={headTextStyle}>
          To continue to your AutoHyve Workshop Profile
        </Typography>
      </Box>
      <Formik
        initialValues={signInModel.initialValues}
        validationSchema={signInModel.schema}
        onSubmit={handleSignIn}
      >
        <SignInForm/>
      </Formik>
      <AppAlert
        alertType="success"
        show={login.success !== undefined}
        message={login.success?.message}
        onClose={login.clearSuccess}
      />
      <AppAlert
        alertType="error"
        show={login.error !== undefined}
        message={login.error?.message}
        onClose={login.clearError}
      />
    </PublicLayout>
  );
}

const headTextStyle = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  mb: '20px',
};

export default withErrorBoundary(SignInPageAdmin);
