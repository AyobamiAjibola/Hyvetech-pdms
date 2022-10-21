import React from "react";
import PublicLayout from "../../components/layouts/PublicLayout";
import { Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import SignInForm from "../../components/forms/authentication/SignInForm";
import signInModel from "../../components/forms/models/signInModel";
import { ISignInModel } from "@app-interfaces";
import useAppDispatch from "../../hooks/useAppDispatch";
import { signInAction } from "../../store/actions/authenicationActions";
import AppAlert from "../../components/alerts/AppAlert";
import useLogin from "../../hooks/useLogin";
import logoLogin from '../../assets/images/logoLogin.png'
import './signInForm.css'

function SignInPage() {
  const dispatch = useAppDispatch();

  const login = useLogin();

  const handleSignIn = (
    values: ISignInModel,
    formikHelpers: FormikHelpers<ISignInModel>
  ) => {
    dispatch(signInAction(values));
    formikHelpers.resetForm();
  };

  return (
    <PublicLayout>
      <img src={logoLogin} alt="" className="loginLogo" />
      <Typography textAlign="center" variant="h4" className="loginTextHeader">
        Welcome to your gateway to boundless opportunities!
      </Typography>
      <Formik
        initialValues={signInModel.initialValues}
        validationSchema={signInModel.schema}
        onSubmit={handleSignIn}
      >
        <SignInForm />
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

export default SignInPage;
