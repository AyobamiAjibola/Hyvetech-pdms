import {
  approveJobCheckListHandler,
  assignCustomerJobHandler,
  assignDriverJobHandler,
  getJobHandler,
  getJobsHandler,
  updateJobVehicleHandler,
} from '../../routes/jobRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const jobEndpoints: RouteEndpoints = [
  {
    name: 'jobs',
    method: 'get',
    path: '/jobs',
    handler: getJobsHandler,
  },
  {
    name: 'jobs',
    method: 'get',
    path: '/jobs/:jobId',
    handler: getJobHandler,
  },
  {
    name: 'jobs',
    method: 'post',
    path: '/jobs/:partnerId/driver-assign',
    handler: assignDriverJobHandler,
  },
  {
    name: 'jobs',
    method: 'post',
    path: '/jobs/:partnerId/customer-assign',
    handler: assignCustomerJobHandler,
  },
  {
    name: 'jobs',
    method: 'patch',
    path: '/jobs/:jobId/checkList',
    handler: approveJobCheckListHandler,
  },
  {
    name: 'jobs',
    method: 'patch',
    path: '/jobs/:jobId/vehicle',
    handler: updateJobVehicleHandler,
  },
];

export default jobEndpoints;
