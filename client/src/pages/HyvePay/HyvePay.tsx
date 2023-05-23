import React from 'react';
// import { AppCan } from '../../context/AbilityContext';
import useAdmin from '../../hooks/useAdmin';
import HyvePayDashboard from './HyvePayDashboard';

function HyvePay() {
  const { isTechAdmin } = useAdmin();

  return (
    <React.Fragment>
      {/* <AppCan I="manage" a="all">
        {isTechAdmin && <HyvePayDashboard />}
      </AppCan> */}

      {isTechAdmin && <HyvePayDashboard />}
    </React.Fragment>
  );
}

export default HyvePay;
