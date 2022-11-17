import React from "react";
import { FormHelperText } from "@mui/material";

interface IErrorField {
  helperStyle?: { [p: string]: string };
  message: string;
  hasError: boolean;
}

function ErrorField(props: IErrorField) {
  return !props.hasError ? null : (
    <FormHelperText sx={{ ...style, ...props.helperStyle }}>{props.message}</FormHelperText>
  );
}

const style = {
  color: "red",
};

export default ErrorField;
