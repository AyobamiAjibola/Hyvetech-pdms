import React, { forwardRef } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Slide } from '@mui/material';

const TransitionLeft = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default TransitionLeft;
