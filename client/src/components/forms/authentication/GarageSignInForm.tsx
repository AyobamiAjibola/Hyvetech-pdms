import React, { useState } from 'react';
import { Form, useFormikContext } from 'formik';
import { Grid, InputAdornment } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import signInModel from '../models/signInModel';
import { ISignInModel } from '@app-interfaces';
import useAppSelector from '../../../hooks/useAppSelector';
import { VerifiedUser, Visibility, VisibilityOff } from '@mui/icons-material';

// interface Props {
//   isSubmitting?: boolean;
// }

// const { fields } = signInModel;

function GarageSignUpForm() {
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
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
            label={signInModel.fields.username.label}
            name={signInModel.fields.username.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VerifiedUser />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            value={values.password}
            label={signInModel.fields.password.label}
            name={signInModel.fields.password.name}
            type={fieldType}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Visibility />
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
            <Link style={{ color: '#FBA91A' }} to="/garage/register">
              Create Account
            </Link>
          </Grid>
          <Grid item>
            <LoadingButton
              loading={authReducer.signingInStatus === 'loading'}
              // disabled={props.isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
              size="large">
              Continue
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}

export default GarageSignUpForm;
