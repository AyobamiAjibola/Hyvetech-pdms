import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useFormikContext } from "formik";
import ErrorField from "./ErrorField";

interface IRadioButtonFieldProps {
  name: string;
  label: string;
  value: string;
  row?: boolean;
  helperStyle?: { [p: string]: string };
  buttons: IRadioButtonsData[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;

  [p: string]: any;
}

export interface IRadioButtonsData {
  label: string;
  value: string;
}

function RadioButtonField(props: IRadioButtonFieldProps) {
  const { errors, touched } = useFormikContext();

  return (
    <FormControl
      // @ts-ignore
      error={errors[props.name] && touched[props.name]}
    >
      <FormLabel id="row-radio-buttons-group-label">{props.label}</FormLabel>
      <RadioGroup aria-labelledby="row-radio-buttons-group-label" row={props.row} {...props}>
        {props.buttons.map((item, index) => (
          <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
        ))}
      </RadioGroup>
      <ErrorField
        helperStyle={props.helperStyle}
        // @ts-ignore
        message={errors[props.name]}
        // @ts-ignore
        hasError={errors[props.name] && touched[props.name]}
      />
    </FormControl>
  );
}

export default RadioButtonField;
