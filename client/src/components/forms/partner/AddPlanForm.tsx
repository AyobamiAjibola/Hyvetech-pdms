import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { Form, useFormikContext } from 'formik';
import React, { useEffect, useMemo } from 'react';

import useAppSelector from '../../../hooks/useAppSelector';
import RadioButtonField from '../fields/RadioButtonField';
import TextInputField from '../fields/TextInputField';
import planModel, { IPlanModel } from '../models/planModel';

export default function AddPlanForm() {
  const { handleChange, values, setFieldValue } = useFormikContext<IPlanModel>();

  useEffect(() => {
    if (values.serviceMode === 'Mobile' || values.serviceMode === 'Drive-in' || values.serviceMode === 'Hybrid') {
      setFieldValue('mobile', '0');
      setFieldValue('driveIn', '0');
    }
  }, [setFieldValue, values.serviceMode]);

  const partnerReducer = useAppSelector(state => state.partnerReducer);

  const computeInspections = useMemo(() => {
    return parseInt(values.driveIn) + parseInt(values.mobile);
  }, [values.driveIn, values.mobile]);

  return (
    <Form>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        alignItems="center"
        sx={{ p: 1 }}>
        <Grid item xs={12} md={6}>
          <RadioButtonField
            row
            name={planModel.fields.programme.name}
            label={planModel.fields.programme.label}
            value={values.programme}
            buttons={[
              { label: 'Inspection', value: 'Inspection' },
              { label: 'Maintenance', value: 'Maintenance' },
            ]}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioButtonField
            row
            name={planModel.fields.serviceMode.name}
            label={planModel.fields.serviceMode.label}
            value={values.serviceMode}
            buttons={[
              { label: 'Mobile', value: 'Mobile' },
              { label: 'Drive-in', value: 'Drive-in' },
              { label: 'Hybrid', value: 'Hybrid' },
            ]}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextInputField
            fullWidth
            onChange={handleChange}
            value={values.label}
            name={planModel.fields.label.name}
            label={planModel.fields.label.label}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: '0' }}
            onChange={handleChange}
            value={values.minVehicles}
            name={planModel.fields.minVehicles.name}
            label={planModel.fields.minVehicles.label}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: '0' }}
            onChange={handleChange}
            value={values.maxVehicles}
            name={planModel.fields.maxVehicles.name}
            label={planModel.fields.maxVehicles.label}
          />
        </Grid>
        <Grid item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: '0', max: '12' }}
            onChange={handleChange}
            value={values.validity}
            name={planModel.fields.validity.name}
            label={`${planModel.fields.validity.label} (month)`}
          />
        </Grid>
        <Grid hidden={values.serviceMode === 'Mobile'} item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: '0' }}
            onChange={handleChange}
            value={values.driveIn}
            name={planModel.fields.driveIn.name}
            label={planModel.fields.driveIn.label}
          />
        </Grid>
        <Grid hidden={values.serviceMode === 'Drive-in'} item xs={3}>
          <TextInputField
            fullWidth
            type="number"
            inputProps={{ min: '0' }}
            onChange={handleChange}
            value={values.mobile}
            name={planModel.fields.mobile.name}
            label={planModel.fields.mobile.label}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Total {values.programme === 'Maintenance' ? 'Services' : 'Inspections'}: {computeInspections}
          </Typography>
        </Grid>
        <Grid item xs mt={1} sx={{ mx: 'auto' }}>
          <LoadingButton
            loading={partnerReducer.addPlanStatus === 'loading'}
            type="submit"
            variant="contained"
            color="info"
            fullWidth
            endIcon={<Save />}>
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
