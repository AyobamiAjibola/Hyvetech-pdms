import React, { useEffect, useState } from 'react';
import { Form, useFormikContext } from 'formik';
import { Grid, Typography } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import garageSignUpModel, { IGarageSignupModel } from '../models/garageSignUpModel';
import SelectField, { ISelectData } from '../fields/SelectField';
import CheckboxField from '../fields/CheckboxField';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import { DIAL_CODES, STATES } from '../../../config/constants';
import './signInForms.css'

interface Props {
  isSubmitting?: boolean;
}

const { fields } = garageSignUpModel;

function GarageSignUpForm(props: Props) {
  const [states, setStates] = useState<ISelectData[]>([]);
  const [dialCodes, setDialCodes] = useState<ISelectData[]>([]);

  const { handleChange, values } = useFormikContext<IGarageSignupModel>();

  useEffect(() => {
    const newStates = STATES.map(state => ({
      label: state.name,
      value: state.name,
    }));

    const newDialCodes = DIAL_CODES.filter(code => code.name === 'Nigeria').map(dialCode => ({
      value: dialCode.dial_code,
      label: `${dialCode.emoji} ${dialCode.dial_code}`,
    }));

    setStates(newStates);
    setDialCodes(newDialCodes);
  }, []);

  return (
    <Form autoComplete="off" className="formContainer">
      <Grid container direction="column">
        <Grid item container xs={12} columnSpacing={2}>
          <Grid item sm={6} xs={12}>
            <TextInputField
              margin="normal"
              onChange={handleChange}
              value={values.firstName}
              name={fields.firstName.name}
              label={fields.firstName.label}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextInputField
              margin="normal"
              onChange={handleChange}
              value={values.lastName}
              name={fields.lastName.name}
              label={fields.lastName.label}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            value={values.name}
            name={fields.name.name}
            label={fields.name.label}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            margin="normal"
            onChange={handleChange}
            value={values.email}
            name={fields.email.name}
            label={fields.email.label}
            type="email"
          />
        </Grid>
        <Grid item container xs={12} spacing={1} my={1}>
          <Grid item xs={3}>
            <SelectField
              onChange={handleChange}
              value={values.dialCode}
              name={fields.dialCode.name}
              label={fields.dialCode.label}
              data={dialCodes}
            />
          </Grid>
          <Grid item xs={9}>
            <TextInputField
              onChange={handleChange}
              value={values.phone}
              name={fields.phone.name}
              label={fields.phone.label}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} my={2}>
          <SelectField
            onChange={handleChange}
            value={values.state}
            name={fields.state.name}
            label={fields.state.label}
            data={states}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} my={1}>
          <CheckboxField
            required
            value={values.isRegistered}
            name={fields.isRegistered.name}
            label={fields.isRegistered.label}
          />
        </Grid>

        <Grid item container xs spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Link style={{ color: '#FBA91A' }} to="/">
              Sign in instead
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
              Proceed
            </LoadingButton>
          </Grid>
        </Grid>

        <Grid item xs={12} mt={5}>
          <Typography textAlign="center">
            By clicking ‘Proceed’ you agree with the AutoHyve Terms and Policies
          </Typography>
        </Grid>
      </Grid>
    </Form>
  );
}

export default GarageSignUpForm;
