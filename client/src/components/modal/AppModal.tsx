import React, { ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import TransitionUp from "../transitions/TransitionUp";

interface IProps {
  show: boolean;
  title: string;
  Content: ReactNode;
  ActionComponent?: ReactNode;
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  fullScreen?: boolean;
}

function AppModal(props: IProps) {
  return (
    <div>
      <Dialog
        open={props.show}
        TransitionComponent={TransitionUp}
        keepMounted
        onClose={props.onClose}
        aria-describedby="app-modal"
        maxWidth={props.size}
        fullWidth={props.fullWidth}
        fullScreen={props.fullScreen}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.Content}</DialogContent>
        {props.ActionComponent && (
          <DialogActions>{props.ActionComponent}</DialogActions>
        )}
      </Dialog>
    </div>
  );
}

export default AppModal;
