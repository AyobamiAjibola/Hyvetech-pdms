import React from 'react';
import { Form, useFormikContext } from 'formik';
import { Grid } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import signInModel from '../models/signInModel';
import { ISignInModel } from '@app-interfaces';

interface Props {
  isSubmitting?: boolean;
}

const { fields } = signInModel;

function GarageSignUpForm(props: Props) {
  const { handleChange, values } = useFormikContext<ISignInModel>();
  return (
    <Form autoComplete="off" className="formContainer">
      <Grid container direction="column">
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            value={values.username}
            name={fields.username.name}
            label={fields.username.label}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            value={values.password}
            name={fields.password.name}
            label={fields.password.label}
            type="password"
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
              loading={props.isSubmitting}
              disabled={props.isSubmitting}
              type="submit"
              variant="contained"
              color="warning"
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
