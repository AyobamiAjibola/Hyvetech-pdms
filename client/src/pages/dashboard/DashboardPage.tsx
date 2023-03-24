import React from 'react';

import AdminDashboard from '../../components/dashboard/AdminDashboard';
import { AppCan } from '../../context/AbilityContext';
import useAdmin from '../../hooks/useAdmin';
import PartnerPage from '../partner/PartnerPage';

function DashboardPage() {
  const { isSuperAdmin } = useAdmin();

  return (
    <React.Fragment>
      <AppCan I="manage" a="all">
        {isSuperAdmin && <AdminDashboard />}
      </AppCan>
      <div>{!isSuperAdmin && <PartnerPage />}</div>
    </React.Fragment>
  );
}

export default DashboardPage;
