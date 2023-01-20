"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estimateRoute_1 = require("../../routes/estimateRoute");
const estimatesPath = '/estimates';
const estimateEndpoints = [
    {
        name: 'create estimate',
        method: 'post',
        path: estimatesPath,
        handler: estimateRoute_1.createEstimateHandler,
    },
    {
        name: 'save estimate',
        method: 'put',
        path: estimatesPath,
        handler: estimateRoute_1.saveEstimateHandler,
    },
    {
        name: 'update estimate',
        method: 'patch',
        path: `/estimate/:estimateId`,
        handler: estimateRoute_1.updateEstimateHandler,
    },
    {
        name: 'save updated estimate',
        method: 'put',
        path: `/estimate/:estimateId`,
        handler: estimateRoute_1.sendDraftEstimateHandler,
    },
    {
        name: 'get estimates',
        method: 'get',
        path: estimatesPath,
        handler: estimateRoute_1.getEstimatesHandler,
    },
    {
        name: 'delete estimate',
        method: 'delete',
        path: `${estimatesPath}/:estimateId`,
        handler: estimateRoute_1.deleteEstimateHandler,
    },
];
exports.default = estimateEndpoints;
