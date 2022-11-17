import { createEstimateHandler, getEstimatesHandler } from '../../routes/estimateRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const estimateEndpoints: RouteEndpoints = [
  {
    name: 'estimates',
    method: 'post',
    path: '/estimates',
    handler: createEstimateHandler,
  },
  {
    name: 'estimates',
    method: 'get',
    path: '/estimates',
    handler: getEstimatesHandler,
  },
];

export default estimateEndpoints;
