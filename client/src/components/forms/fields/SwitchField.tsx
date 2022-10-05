import React, { FocusEvent } from "react";

import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useFormikContext } from "formik";
import ErrorField from "./ErrorField";

interface IProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  size?: "small" | "medium";
  value: boolean;
  name: string;
  label: string;

  [p: string]: any;
}

function SwitchField(props: IProps) {
  const { errors, touched } = useFormikContext();

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={props.value}
            onChange={props.onChange}
            name={props.name}
            onBlur={props.onBlur}
            size={props.size}
          />
        }
        label={props.label}
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

export default SwitchField;
