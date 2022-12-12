import {
  createEstimateHandler,
  getEstimatesHandler,
  saveEstimateHandler,
  sendDraftEstimateHandler,
  updateEstimateHandler,
} from '../../routes/estimateRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const estimatesPath = '/estimates';
const estimateEndpoints: RouteEndpoints = [
  {
    name: 'create estimate',
    method: 'post',
    path: estimatesPath,
    handler: createEstimateHandler,
  },
  {
    name: 'save estimate',
    method: 'put',
    path: estimatesPath,
    handler: saveEstimateHandler,
  },
  {
    name: 'update estimate',
    method: 'patch',
    path: `/estimate/:estimateId`,
    handler: updateEstimateHandler,
  },
  {
    name: 'save updated estimate',
    method: 'put',
    path: `/estimate/:estimateId`,
    handler: sendDraftEstimateHandler,
  },
  {
    name: 'get estimates',
    method: 'get',
    path: estimatesPath,
    handler: getEstimatesHandler,
  },
];

export default estimateEndpoints;
