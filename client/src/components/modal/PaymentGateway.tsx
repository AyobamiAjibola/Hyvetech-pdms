import React, { FC, useRef } from 'react';
import AppModal from './AppModal';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  show: boolean;
  onClose: () => void;
  authUrl: string;
}

const PaymentGateway: FC<Props> = ({ onClose, show, authUrl }) => {
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <AppModal
      fullWidth
      size="xs"
      show={show}
      contentHeight={800}
      Content={
        !authUrl.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <iframe
            ref={ref}
            src={authUrl}
            style={{ border: 'none' }}
            title="Online Payment"
            width="100%"
            height="100%"
          />
        )
      }
      onClose={onClose}
    />
  );
};

export default PaymentGateway;
