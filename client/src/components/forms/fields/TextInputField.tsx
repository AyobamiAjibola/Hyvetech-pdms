import React, { ChangeEvent, FocusEvent } from "react";
import { FormGroup, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import ErrorField from "./ErrorField";

interface ITextInputFieldProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string | number | boolean;
  name: string;
  label: string;

  [p: string]: any;
}

function TextInputField(props: ITextInputFieldProps) {
  const { errors, touched } = useFormikContext();

  return (
    <FormGroup sx={props.inputGroupStyle}>
      <TextField
        onBlur={props.onBlur}
        sx={props.textInputStyle}
        fullWidth
        // @ts-ignore
        error={errors[props.name] && touched[props.name]}
        {...props}
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

export default TextInputField;
