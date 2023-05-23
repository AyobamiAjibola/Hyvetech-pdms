import React from 'react';
// import { AppCan } from '../../context/AbilityContext';
import useAdmin from '../../hooks/useAdmin';
import KycRequestPage from './KycRequestPage';

function KycRequests() {
  const { isSuperAdmin } = useAdmin();

  return (
    <React.Fragment>
      {/* <AppCan I="manage" a="all">
        {isTechAdmin && <HyvePayDashboard />}
      </AppCan> */}

      {isSuperAdmin && <KycRequestPage />}
    </React.Fragment>
  );
}

export default KycRequests;
