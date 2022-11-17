import React, { ReactNode } from 'react';
import { AppBar, Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransitionUp from '../transitions/TransitionUp';

interface IProps {
  open: boolean;
  Content: ReactNode;
  onClose: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
}

function BookingModal(props: IProps) {
  return (
    <div>
      <Dialog
        fullScreen={props.fullScreen}
        maxWidth={props.size}
        fullWidth={props.fullWidth}
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={TransitionUp}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>{props.Content}</DialogContent>
      </Dialog>
    </div>
  );
}

export default BookingModal;
