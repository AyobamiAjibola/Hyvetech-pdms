import React, { SyntheticEvent } from "react";

import {
  Autocomplete,
  AutocompleteChangeReason,
  createFilterOptions,
  TextField,
} from "@mui/material";
import bookingModel from "../../../components/forms/models/bookingModel";
import { useFormikContext } from "formik";
import { IBookingFormValues } from "./BookingForm";
import useAppSelector from "../../../hooks/useAppSelector";

interface IFilmOptionType {
  inputValue?: string;
  title: string;
}

const filter = createFilterOptions<IFilmOptionType>();

function Location() {
  const { values, setFieldValue, handleBlur, errors, touched } =
    useFormikContext<IBookingFormValues>();

  const customerReducer = useAppSelector((state) => state.customerReducer);

  const _handleChange = (
    event: SyntheticEvent,
    value: any,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "clear")
      return setFieldValue(bookingModel.fields.location.name, "");
    if (typeof value === "string")
      return setFieldValue(bookingModel.fields.location.name, value);

    if (value.inputValue)
      return setFieldValue(bookingModel.fields.location.name, value.inputValue);
  };

  return (
    <Autocomplete
      onChange={_handleChange}
      onBlur={handleBlur}
      value={values.location}
      fullWidth
      className="locationTextField"
      freeSolo
      getOptionLabel={(option: IFilmOptionType | any) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
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
        const filtered: IFilmOptionType[] | any = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option: { title: string }) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={bookingModel.fields.location.name}
          label={bookingModel.fields.location.label}
          fullWidth
          error={
            errors.location !== undefined && touched.location !== undefined
          }
          helperText={errors.location && touched.location && errors.location}
        />
      )}
      options={customerReducer.contacts
        .filter((value) => value.address)
        .map((value) => value.label)}
      isOptionEqualToValue={(option: any, value) =>
        option.label === value.label
      }
    />
  );
}

export default Location;
