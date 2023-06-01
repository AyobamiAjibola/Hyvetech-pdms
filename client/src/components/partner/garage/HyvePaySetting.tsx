import { LoadingButton } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { updateCBAccountUpdate } from '../../../store/actions/autoHyveActions';
import { clearCBAUpdateStatus } from '../../../store/reducers/autoHyveReducer';
import AppAlert from '../../alerts/AppAlert';

const HyvePaySetting = () => {
  const dispatch = useAppDispatch();
  const hyveState = useAppSelector(state => state.autoHyveReducer);
  const [alerMessage, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (hyveState.performCBAUpdateStatus === 'completed') {
      //
      setAlert({ type: 'success', message: 'Operation successful' });
      setTimeout(() => {
        dispatch(clearCBAUpdateStatus());
      }, 2000);
    }
  }, [hyveState.performCBAUpdateStatus]);

  return (
    <div>
      <Formik
        initialValues={{ pin: '' }}
        onSubmit={async values => {
          dispatch(updateCBAccountUpdate({ pin: values.pin }));
        }}
        validate={values => {
          const errors: { pin?: string | undefined } = {};
          if (!values.pin) {
            errors.pin = 'PIN is Required';
          } else if (values.pin.trim() === '') {
            errors.pin = 'PIN can not be empty';
          }
          return errors;
        }}>
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  value={values.pin}
                  onChange={handleChange}
                  label="HyvePay PIN"
                  type="password"
                  name="pin"
                />
                <ErrorMessage name="pin" component="div" />
              </Grid>
            </Grid>
            <br />
            <LoadingButton
              variant="contained"
              loading={hyveState.performCBAUpdateStatus === 'loading'}
              type="submit"
              disabled={hyveState.performCBAUpdateStatus === 'loading'}>
              Submit
            </LoadingButton>
          </Form>
        )}
      </Formik>
      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage ? alerMessage.type : 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message || ''}
      />
    </div>
  );
};

export default HyvePaySetting;
