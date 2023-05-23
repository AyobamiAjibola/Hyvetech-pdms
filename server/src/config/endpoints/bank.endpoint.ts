import { dashboardHandler, dashboardTechHandler, dashboardSuperAdminHandler } from '../../routes/dashboardRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import { getBankHandler } from '../../routes/bankRoute';

const bankEndpoints: RouteEndpoints = [
  {
    name: 'banks',
    method: 'get',
    path: '/banks',
    handler: getBankHandler,
  },
];
export default bankEndpoints;
