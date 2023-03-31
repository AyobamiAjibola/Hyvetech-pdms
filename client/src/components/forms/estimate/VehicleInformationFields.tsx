import React, { memo } from 'react';
import { CircularProgress, Divider, Grid, InputAdornment, Typography, Autocomplete, TextField } from '@mui/material';
import TextInputField from '../fields/TextInputField';
import SelectField from '../fields/SelectField';
import estimateModel, { IEstimateValues } from '../models/estimateModel';
import useAppSelector from '../../../hooks/useAppSelector';

const { fields } = estimateModel;

interface IProps {
  values: IEstimateValues;
  handleChange: any;
  handleChangeVIN: any;
  disabled?: boolean;
  vinOptions?: any;
}

function VehicleInformationFields(props: IProps) {
  const vehicleReducer = useAppSelector(state => state.vehicleReducer);
  console.log(props.vinOptions, "props.vinOptions")

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography gutterBottom variant="subtitle1" component="h1">
          Vehicle Information
        </Typography>
        <Divider orientation="horizontal" />
      </Grid>
      <Grid item xs={4}>

        <Autocomplete
          options={props.vinOptions || []}
          // onChange={props.handleChangeVIN}
          // @ts-ignore
          onChange={(_, newValue) => {
            // console.log(newValue)
            props.handleChangeVIN({ target: { value: newValue } })
          }}
          value={props.values.vin}
          // name={fields.vin.name}
          disabled={props.disabled}
          renderInput={params =>
            <TextField
              {...params}
              label={fields.vin.label}
              name={fields.vin.name}
              onChange={(e) => {
                // console.log(e.target.value)
                props.handleChangeVIN(e)
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end" sx={{ position: 'absolute', left: '90%' }}>
                    {vehicleReducer.getVehicleVINStatus === 'loading' && <CircularProgress size={25} />}
                  </InputAdornment>
                ),
              }}
            />}
        />

        {/* <TextInputField
          label={fields.vin.label}
          disabled={props.disabled}
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
        /> */}
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          disabled={props.disabled}
          label={fields.modelYear.label}
          value={props.values.modelYear}
          name={fields.modelYear.name}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          disabled={props.disabled}
          label={fields.make.label}
          value={props.values.make}
          name={fields.make.name}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          disabled={props.disabled}
          value={props.values.model}
          name={fields.model.name}
          label={fields.model.label}
        />
      </Grid>
      <Grid item xs={4}>
        <TextInputField
          onChange={props.handleChange}
          disabled={props.disabled}
          value={props.values.plateNumber}
          name={fields.plateNumber.name}
          label={fields.plateNumber.label}
        />
      </Grid>
      <Grid item sm={4} xs={12} container spacing={0.5}>
        <Grid item sm={8} xs={6}>
          <TextInputField
            onChange={props.handleChange}
            disabled={props.disabled}
            value={props.values.mileage.count}
            name="mileage.count"
            label={fields.mileageValue.label}
          />
        </Grid>
        <Grid item sm={4} xs={6}>
          <SelectField
            data={[
              { label: 'miles', value: 'miles' },
              { label: 'km', value: 'km' },
            ]}
            onChange={props.handleChange}
            disabled={props.disabled}
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
