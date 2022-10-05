import React from "react";
import { useFormikContext } from "formik";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { FormGroup, TextField } from "@mui/material";
import ErrorField from "./ErrorField";

type DateView = "day" | "month" | "year";

interface IDateTimeFieldProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  size?: "small" | "medium";
  value?: Date;
  name: string;
  label: string;
  views?: [DateView];

  [p: string]: any;
}

function DateTimeInputField(props: IDateTimeFieldProps) {
  const { errors, touched, setFieldValue } = useFormikContext<any>();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormGroup sx={props.inputGroupStyle}>
        <MobileDateTimePicker
          disablePast
          onChange={(date) => {
            setFieldValue(props.name, date);
          }}
          value={props.value}
          renderInput={(params) => <TextField {...params} {...props} />}
        />
        <ErrorField
          helperStyle={props.helperStyle}
          // @ts-ignore
          message={errors[props.name]}
          // @ts-ignore
          hasError={errors[props.name] && touched[props.name]}
        />
      </FormGroup>
    </LocalizationProvider>
  );
}

export default DateTimeInputField;
