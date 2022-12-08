import React, { ChangeEvent } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { useFormikContext } from 'formik';

interface ICheckboxFieldProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  required?: boolean;
  size?: 'small' | 'medium';
  value: boolean;
  name: string;
  label: string;
}

function CheckboxField(props: ICheckboxFieldProps) {
  const { errors, touched, setFieldValue } = useFormikContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(props.name, e.target.checked);
  };

  const hasError = () =>
    //@ts-ignore
    errors[props.name] !== undefined && touched[props.name];

  return (
    <FormControl
      required={props.required}
      fullWidth={props.fullWidth}
      error={hasError()}
      component="fieldset"
      variant="standard">
      <FormGroup>
        <FormControlLabel
          control={<Checkbox size={props.size} checked={props.value} onChange={handleChange} name={props.name} />}
          label={props.label}
        />
      </FormGroup>
      {
        //@ts-ignore
        hasError() && <FormHelperText>{errors[props.name]}</FormHelperText>
      }
    </FormControl>
  );
}

export default CheckboxField;
