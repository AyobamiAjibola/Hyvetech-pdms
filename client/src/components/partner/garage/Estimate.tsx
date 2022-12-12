import React, { useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { Formik } from 'formik';
import estimateModel from '../../forms/models/estimateModel';
import EstimateForm from '../../forms/estimate/EstimateForm';
import { CustomerPageContextProps } from '@app-interfaces';
import useAppSelector from '../../../hooks/useAppSelector';
import AppAlert from '../../alerts/AppAlert';
import useEstimate from '../../../hooks/useEstimate';
import { CustomerPageContext } from '../../../pages/customer/CustomerPage';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { clearCreateEstimateStatus, clearSaveEstimateStatus } from '../../../store/reducers/estimateReducer';

export default function Estimate() {
  const estimateReducer = useAppSelector(state => state.estimateReducer);
  const dispatch = useAppDispatch();

  const { customer } = useContext(CustomerPageContext) as CustomerPageContextProps;

  const estimate = useEstimate();

  useEffect(() => {
    if (customer) {
      estimate.setInitialValues(prevState => ({
        ...prevState,
        firstName: customer.firstName ? customer.firstName : '',
        lastName: customer.lastName ? customer.lastName : '',
        phone: customer.phone ? customer.phone : '',
        address: '',
        addressType: '',
      }));
    }
    // eslint-disable-next-line
  }, [customer]);

  useEffect(() => {
    dispatch(clearCreateEstimateStatus());
    dispatch(clearSaveEstimateStatus());
    estimate.setSave(false);
  }, [dispatch, estimate]);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Box sx={{ minWidth: '100%' }}>
          <Formik
            onSubmit={(values, formikHelpers) => {
              if (estimate.save) {
                estimate.handleSaveEstimate(values, formikHelpers);
              } else estimate.handleCreateEstimate(values, formikHelpers);
            }}
            initialValues={estimate.initialValues}
            validationSchema={estimateModel.schema}
            enableReinitialize>
            <EstimateForm
              isSubmitting={
                estimateReducer.createEstimateStatus === 'loading' || estimateReducer.saveEstimateStatus === 'loading'
              }
              setGrandTotal={estimate.setGrandTotal}
              setPartTotal={estimate.setPartTotal}
              setLabourTotal={estimate.setLabourTotal}
              grandTotal={estimate.grandTotal}
              labourTotal={estimate.labourTotal}
              partTotal={estimate.partTotal}
              setSave={estimate.setSave}
            />
          </Formik>
        </Box>
      </Box>
      <AppAlert
        alertType="success"
        show={undefined !== estimate.success}
        message={estimate.success?.message}
        onClose={() => estimate.setSuccess(undefined)}
      />
      <AppAlert
        alertType="error"
        show={undefined !== estimate.error}
        message={estimate.error?.message}
        onClose={() => estimate.setError(undefined)}
      />
    </React.Fragment>
  );
}
