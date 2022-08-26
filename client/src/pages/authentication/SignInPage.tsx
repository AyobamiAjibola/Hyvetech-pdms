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

function SignInPage() {
  const dispatch = useAppDispatch();

  const login = useLogin();

  const handleSignIn = (
    values: ISignInModel,
    formikHelpers: FormikHelpers<ISignInModel>
  ) => {
    // @ts-ignore
    dispatch(signInAction(values));

    formikHelpers.resetForm();
  };

  return (
    <PublicLayout>
      <Typography textAlign="center" variant="h4" component="div">
        Sign In
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
    </PublicLayout>
  );
}

export default SignInPage;
