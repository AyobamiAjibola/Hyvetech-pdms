import React from "react";
import { Form, useFormikContext } from "formik";
import { Grid, InputAdornment } from "@mui/material";
import TextInputField from "../fields/TextInputField";
import { Lock, VerifiedUser, Visibility } from "@mui/icons-material";

import { ISignInModel } from "@app-interfaces";
import signInModel from "../models/signInModel";
import { LoadingButton } from "@mui/lab";
import useAppSelector from "../../../hooks/useAppSelector";

function SignInForm() {
  const { handleChange, handleBlur, values } = useFormikContext<ISignInModel>();

  const authReducer = useAppSelector((state) => state.authenticationReducer);

  return (
    <Form autoComplete="off">
      <Grid container direction="column">
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
            label={signInModel.fields.username.label}
            name={signInModel.fields.username.name}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VerifiedUser />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInputField
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            label={signInModel.fields.password.label}
            name={signInModel.fields.password.name}
            type={signInModel.fields.password.name}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Visibility />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
          <LoadingButton
            startIcon={<Lock />}
            loading={authReducer.signingInStatus === "loading"}
            loadingPosition="start"
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
          >
            Login
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}

export default SignInForm;
