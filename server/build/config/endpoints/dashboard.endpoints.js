"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardRoute_1 = require("../../routes/dashboardRoute");
const dashboardEndpoints = [
    {
        name: 'dashboard',
        method: 'get',
        path: '/dashboard',
        handler: dashboardRoute_1.dashboardHandler,
    },
];
exports.default = dashboardEndpoints;
