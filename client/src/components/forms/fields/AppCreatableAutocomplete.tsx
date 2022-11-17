import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useFormikContext } from "formik";
import { FormGroup } from "@mui/material";
import ErrorField from "./ErrorField";

export interface ICreatableAutocompleteOptions {
  inputValue?: string;
  label: string;
  value?: any;
}

interface IProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  options: ICreatableAutocompleteOptions[];
  label: string;
  value: string;
  name: string;
}

const filter = createFilterOptions<ICreatableAutocompleteOptions>();

export default function AppCreatableAutocomplete(props: IProps) {
  const { setFieldValue, errors, touched } = useFormikContext();

  const handleChange = (value: any) => setFieldValue(props.name, value);

  return (
    <FormGroup>
      <Autocomplete
        value={props.value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            handleChange(newValue);
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            handleChange(newValue.inputValue);
          } else {
            handleChange(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.label);
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              label: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id={props.label}
        options={props.options}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.label;
        }}
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            // @ts-ignore
            error={errors[props.name] && touched[props.name]}
            fullWidth
            label={props.label}
          />
        )}
      />
      <ErrorField
        helperStyle={props.helperStyle}
        // @ts-ignore
        message={errors[props.name]}
        // @ts-ignore
        hasError={errors[props.name] && touched[props.name]}
      />
    </FormGroup>
  );
}
