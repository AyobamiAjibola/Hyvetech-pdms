import React, { SyntheticEvent, useContext } from 'react';
import { Autocomplete, AutocompleteChangeReason, TextField } from '@mui/material';
import { AppContext } from '../../../context/AppContextProvider';
import { AppContextProps } from '@app-interfaces';
import { useFormikContext } from 'formik';
import bookingModel from '../models/bookingModel';
import { filterOptions, IOptionType } from './Location';

function Vehicle() {
  const { values, setFieldValue, handleBlur, errors, touched } = useFormikContext<any>();

  const { vehicles } = useContext(AppContext) as AppContextProps;

  const _handleChange = (_: SyntheticEvent, value: any, reason: AutocompleteChangeReason) => {
    if (reason === 'clear') return setFieldValue(bookingModel.fields.vehicle.name, '');
    if (typeof value === 'string') return setFieldValue(bookingModel.fields.vehicle.name, value);

    if (value.inputValue) return setFieldValue(bookingModel.fields.vehicle.name, value.inputValue);
  };

  if (vehicles.length === 0) return null;
  else
    return (
      <Autocomplete
        onChange={_handleChange}
        onBlur={handleBlur}
        value={values.vehicle}
        fullWidth
        freeSolo
        getOptionLabel={(option: IOptionType | any) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        filterOptions={(options: any, params: any) => {
          const filtered: IOptionType[] | any = filterOptions(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option: { title: string }) => inputValue === option.title);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        renderInput={params => (
          <TextField
            {...params}
            name={bookingModel.fields.vehicle.name}
            label={bookingModel.fields.vehicle.label}
            fullWidth
            error={errors.vehicle !== undefined && touched.vehicle !== undefined}
            //@ts-ignore
            helperText={errors.vehicle && touched.vehicle && errors.vehicle}
          />
        )}
        options={vehicles
          .filter(value => !value.isBooked)
          .map(vehicle => `(${vehicle.modelYear}) ${vehicle.make} ${vehicle.model}`)}
        isOptionEqualToValue={(option: any, value) => option.label === value.label}
      />
    );
}

export default Vehicle;
