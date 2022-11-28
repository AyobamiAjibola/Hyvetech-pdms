import { payStackBanksHandler, statesAndDistrictsHandler } from '../../routes/miscellaneousHandler';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const miscellaneousEndpoints: RouteEndpoints = [
  {
    name: 'states and districts',
    method: 'get',
    path: '/states',
    handler: statesAndDistrictsHandler,
  },
  {
    name: 'paystack banks',
    method: 'get',
    path: '/paystack/banks',
    handler: payStackBanksHandler,
  },
];

export default miscellaneousEndpoints;
