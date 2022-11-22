import {
  approveJobCheckListHandler,
  assignCustomerJobHandler,
  assignDriverJobHandler,
  assignJobHandler,
  cancelJobHandler,
  getJobHandler,
  getJobsHandler,
  reassignJobHandler,
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
    path: '/jobs/:partnerId/assign',
    handler: assignJobHandler,
  },
  {
    name: 'jobs',
    method: 'post',
    path: '/jobs/:partnerId/cancel',
    handler: cancelJobHandler,
  },
  {
    name: 'jobs',
    method: 'post',
    path: '/jobs/:partnerId/reassign',
    handler: reassignJobHandler,
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
