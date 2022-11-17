import React, { FocusEvent } from 'react';
import { useFormikContext } from 'formik';
import { FormControl, FormGroup, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ErrorField from './ErrorField';

export interface ISelectData {
  label: string;
  value: string;
}

interface ISelectFieldProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  multiple?: boolean;
  onChange: (event: SelectChangeEvent<any>) => void;
  onBlur?: (event: FocusEvent<any>) => void;
  value: any;
  name: string;
  label: string;
  data: ISelectData[];
  onClick?: (params?: ISelectData) => void;

  [p: string]: any;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectField(props: ISelectFieldProps) {
  const { errors, touched } = useFormikContext();

  return (
    <FormGroup sx={props.inputGroupStyle}>
      <FormControl
        fullWidth={props.fullWidth}
        // @ts-ignore
        error={errors[props.name] && touched[props.name]}>
        <InputLabel id={props.name}>{props.label}</InputLabel>
        <Select
          sx={props.textInputStyle}
          size={props.size}
          labelId={props.name}
          multiple={props.multiple}
          id={props.name}
          value={props.value}
          name={props.name}
          label={props.label}
          onChange={props.onChange}
          MenuProps={MenuProps}>
          <MenuItem value="">...</MenuItem>
          {props.data.map((item, index) => {
            return (
              <MenuItem
                onClick={() => {
                  if (props.onClick) props.onClick(item);
                }}
                key={index}
                value={item.value}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
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
