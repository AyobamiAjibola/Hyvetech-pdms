import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { CallableFunction } from "@app-types";
import TransitionLeft from "../transitions/TransitionLeft";

export default function AppAlert(props: AppAlertProps) {
  const { duration = 3000 } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={props.show}
      autoHideDuration={duration}
      onClose={props.onClose}
      TransitionComponent={TransitionLeft}
      key={props.message}
    >
      <Alert
        onClose={props.onClose}
        variant="filled"
        severity={props.alertType}
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}

interface AppAlertProps {
  alertType: "success" | "info" | "warning" | "error";
  show: boolean;
  message: any;
  onClose: CallableFunction;
  duration?: number;
}
