import React, { useState } from 'react';
import { Form, useFormikContext } from 'formik';
import { Grid, InputAdornment } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import { Lock, VerifiedUser, Visibility, VisibilityOff } from '@mui/icons-material';

import { ISignInModel } from '@app-interfaces';
import signInModel from '../models/signInModel';
import { LoadingButton } from '@mui/lab';
import useAppSelector from '../../../hooks/useAppSelector';
import './signInForms.css';
// import { Link } from 'react-router-dom';

function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<string>('password');

  const { handleChange, handleBlur, values } = useFormikContext<ISignInModel>();

  const authReducer = useAppSelector(state => state.authenticationReducer);

  const togglePasswordVisibility = () => {
    setFieldType(fieldType === 'text' ? 'password' : 'text');
    setShowPassword(!showPassword);
  };

  return (
    <Form autoComplete="off" className="formContainer">
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
            type={fieldType}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment onClick={togglePasswordVisibility} position="start" sx={{ cursor: 'pointer' }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item container xs spacing={2} my={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            {/* <Link style={{ color: '#FBA91A' }} to="/garage/register">
              Create Account
            </Link> */}
          </Grid>
          <Grid item>
            <LoadingButton
              loading={authReducer.signingInStatus === 'loading'}
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

        {/* <Grid item container my={2} justifyContent="space-between" alignItems="center" xs>
          <Grid item />
          <Grid item>
            <Link>Forgot my password</Link>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
          <LoadingButton
            loading={authReducer.signingInStatus === 'loading'}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary">
            Login
          </LoadingButton>
        </Grid> */}
      </Grid>
    </Form>
  );
}

export default SignInForm;
