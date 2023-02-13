"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jobRoute_1 = require("../../routes/jobRoute");
const jobEndpoints = [
    {
        name: 'jobs',
        method: 'get',
        path: '/jobs',
        handler: jobRoute_1.getJobsHandler,
    },
    {
        name: 'jobs',
        method: 'get',
        path: '/jobs/:jobId',
        handler: jobRoute_1.getJobHandler,
    },
    {
        name: 'jobs',
        method: 'post',
        path: '/jobs/:partnerId/driver-assign',
        handler: jobRoute_1.assignDriverJobHandler,
    },
    {
        name: 'jobs',
        method: 'post',
        path: '/jobs/:partnerId/assign',
        handler: jobRoute_1.assignJobHandler,
    },
    {
        name: 'jobs',
        method: 'post',
        path: '/jobs/:partnerId/cancel',
        handler: jobRoute_1.cancelJobHandler,
    },
    {
        name: 'jobs',
        method: 'post',
        path: '/jobs/:partnerId/reassign',
        handler: jobRoute_1.reassignJobHandler,
    },
    {
        name: 'jobs',
        method: 'post',
        path: '/jobs/:partnerId/customer-assign',
        handler: jobRoute_1.assignCustomerJobHandler,
    },
    {
        name: 'jobs',
        method: 'patch',
        path: '/jobs/:jobId/checkList',
        handler: jobRoute_1.approveJobCheckListHandler,
    },
    {
        name: 'jobs',
        method: 'patch',
        path: '/jobs/:jobId/vehicle',
        handler: jobRoute_1.updateJobVehicleHandler,
    },
    {
        name: 'jobs',
        method: 'patch',
        path: '/jobs/:jobId/upload-report',
        handler: jobRoute_1.uploadJobReportHandler,
    },
];
exports.default = jobEndpoints;
