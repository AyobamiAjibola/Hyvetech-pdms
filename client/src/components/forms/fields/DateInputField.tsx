import React, { FocusEvent } from 'react';
import { useFormikContext } from 'formik';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { FormGroup, TextField } from '@mui/material';
import ErrorField from './ErrorField';

type DateView = 'day' | 'month' | 'year';

interface IDateTimeFieldProps {
  inputGroupStyle?: { [p: string]: string };
  textInputStyle?: { [p: string]: string };
  helperStyle?: { [p: string]: string };
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  value: Date;
  name: string;
  label: string;
  views?: [DateView];

  [p: string]: any;
}

export default function DateInputField(props: IDateTimeFieldProps) {
  const { errors, touched, setFieldValue, setFieldTouched } = useFormikContext();

  const handleChange = (date: Date | null) => {
    setFieldValue(props.name, date);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldTouched(props.name, event.target.value.length === 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormGroup sx={props.inputGroupStyle}>
        <DesktopDatePicker
          views={props.views}
          onChange={handleChange}
          value={props.value}
          //@ts-ignore
          date={props.value}
          rawValue={props.value}
          renderInput={params => <TextField {...params} {...props} onBlur={handleBlur} />}
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
