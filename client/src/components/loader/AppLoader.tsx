import React from 'react';
import Lottie from 'lottie-react';

import Loader from '../../assets/plugins/lottie/loader3.json';
import { Backdrop } from '@mui/material';

type IAppProps = {
  height?: number;
  width?: number;
  show: boolean;
};

function AppLoader({ height = 80, width = 80, show = false }: IAppProps) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Loader,
    width: width,
    height: height,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return !show ? null : (
    <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} open={show}>
      <Lottie {...defaultOptions} />
    </Backdrop>
  );
}

AppLoader.propTypes = {};

export default AppLoader;

/*
(
    <div className={styles.loader}>
      <div className={styles.centerLoader}>
        
      </div>
    </div>
 */
