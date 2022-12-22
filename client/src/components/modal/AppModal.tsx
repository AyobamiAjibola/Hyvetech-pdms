import React, { ReactNode, useRef } from 'react';
import { AppBar, Dialog, DialogContent, DialogTitle, IconButton, Toolbar } from '@mui/material';
import TransitionUp from '../transitions/TransitionUp';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
  show: boolean;
  title?: string;
  Content: ReactNode;
  ActionComponent?: ReactNode;
  onClose: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  contentHeight?: number;
}

function AppModal(props: IProps) {
  const ref = useRef<HTMLElement>(null);
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
        scroll="paper">
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent ref={ref} sx={{ height: props.contentHeight }}>
          {props.Content}
        </DialogContent>
        {props.ActionComponent && props.ActionComponent}
      </Dialog>
    </div>
  );
}

export default AppModal;
