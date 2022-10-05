import React from "react";
import { AppCan } from "../../context/AbilityContext";
import GarageDashboard from "../../components/dashboard/GarageDashboard";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import useAdmin from "../../hooks/useAdmin";

function DashboardPage() {
  const { isSuperAdmin } = useAdmin();

  return (
    <React.Fragment>
      <AppCan I="manage" a="all">
        {isSuperAdmin && <AdminDashboard />}
      </AppCan>
      <AppCan I="manage" an="technician">
        {!isSuperAdmin && <GarageDashboard />}
      </AppCan>
    </React.Fragment>
  );
}

export default DashboardPage;
