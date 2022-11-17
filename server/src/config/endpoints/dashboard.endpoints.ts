import { dashboardHandler } from '../../routes/dashboardRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const dashboardEndpoints: RouteEndpoints = [
  {
    name: 'dashboard',
    method: 'get',
    path: '/dashboard',
    handler: dashboardHandler,
  },
];
export default dashboardEndpoints;
