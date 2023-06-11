import { LoadingButton } from '@mui/lab';
import { Grid, TextField, Typography } from '@mui/material';
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
    } else if (hyveState.performCBAUpdateStatus === 'failed') {
      //
      if (hyveState.performCBAUpdateError?.trim() !== '')
        setAlert({ type: 'error', message: hyveState.performCBAUpdateError || 'Operation failed' });

      dispatch(clearCBAUpdateStatus());
    }
  }, [hyveState.performCBAUpdateStatus]);

  return (
    <div>
      <Typography variant="h5">Reset PIN</Typography>
      <hr />
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Formik
          initialValues={{ pin: '', currentPin: '', confirmPin: '' }}
          onSubmit={async values => {
            dispatch(updateCBAccountUpdate({ pin: values.pin, currentPin: values.currentPin }));
          }}
          validate={values => {
            const errors: {
              pin?: string | undefined;
              currentPin?: string | undefined;
              confirmPin?: string | undefined;
            } = {};
            if (!values.currentPin) {
              errors.currentPin = 'Current PIN is Required';
            } else if (values.currentPin.trim() === '') {
              errors.currentPin = 'Current PIN can not be empty';
            } else if (!values.pin || values.pin.trim() === '') {
              errors.pin = 'New PIN can not be empty';
            } else if (values.pin !== values.confirmPin) {
              errors.pin = 'New PIN and confirm PIN do not match';
            }
            return errors;
          }}>
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item md={6}>
                  <TextField
                    fullWidth
                    value={values.currentPin}
                    onChange={handleChange}
                    label="Enter Current PIN"
                    type="password"
                    name="currentPin"
                  />
                  <div style={{ marginBottom: 20 }}>
                    <ErrorMessage className="error-tag" name="currentPin" component="div" />
                  </div>
                  <TextField
                    fullWidth
                    value={values.pin}
                    onChange={handleChange}
                    label="Enter new PIN"
                    type="password"
                    name="pin"
                  />
                  <div style={{ marginBottom: 20 }}>
                    <ErrorMessage className="error-tag" name="pin" component="div" />
                  </div>

                  <TextField
                    fullWidth
                    value={values.confirmPin}
                    onChange={handleChange}
                    label="Confirm PIN"
                    type="password"
                    name="confirmPin"
                  />
                  <div style={{ marginBottom: 20 }}>
                    <ErrorMessage className="error-tag" name="confirmPin" component="div" />
                  </div>
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
      </div>
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
