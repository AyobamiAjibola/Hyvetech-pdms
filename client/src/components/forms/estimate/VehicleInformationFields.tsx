import React, { memo } from 'react';
import { CircularProgress, Divider, Grid, InputAdornment, Typography } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import SelectField from '../fields/SelectField';
import estimateModel, { IEstimateValues } from '../models/estimateModel';
import useAppSelector from '../../../hooks/useAppSelector';

const { fields } = estimateModel;

interface IProps {
  values: IEstimateValues;
  handleChange: any;
  handleChangeVIN: any;
}

function VehicleInformationFields(props: IProps) {
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1" component="h1">
          Vehicle Information
        </Typography>
        <Divider orientation="horizontal" />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          label={fields.vin.label}
          name={fields.vin.name}
          value={props.values.vin}
          onChange={props.handleChangeVIN}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ position: 'absolute', left: '90%' }}>
                {vehicleReducer.getVehicleVINStatus === 'loading' && <CircularProgress size={25} />}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          label={fields.modelYear.label}
          value={props.values.modelYear}
          name={fields.modelYear.name}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          label={fields.make.label}
          value={props.values.make}
          name={fields.make.name}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          value={props.values.model}
          name={fields.model.name}
          label={fields.model.label}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          value={props.values.plateNumber}
          name={fields.plateNumber.name}
          label={fields.plateNumber.label}
        />
      </Grid>
      <Grid item xs={4} container spacing={0.5}>
        <Grid item xs={8}>
          <TextInputField
            onChange={props.handleChange}
            value={props.values.mileage.count}
            name="mileage.count"
            label={fields.mileage.label}
          />
        </Grid>
        <Grid item xs>
          <SelectField
            data={[
              { label: 'miles', value: 'miles' },
              { label: 'km', value: 'km' },
            ]}
            onChange={props.handleChange}
            value={props.values.mileage.unit}
            name="mileage.unit"
            label="Unit"
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default memo(VehicleInformationFields);
