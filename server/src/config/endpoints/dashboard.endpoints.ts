import { dashboardHandler, dashboardTechHandler } from '../../routes/dashboardRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const dashboardEndpoints: RouteEndpoints = [
  {
    name: 'dashboard',
    method: 'get',
    path: '/dashboard',
    handler: dashboardHandler,
  },

  {
    name: 'dashboard for tech',
    method: 'get',
    path: '/dashboard-tech',
    handler: dashboardTechHandler,
  },
];
export default dashboardEndpoints;
