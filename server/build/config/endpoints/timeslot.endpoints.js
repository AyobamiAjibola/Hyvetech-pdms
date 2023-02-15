"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeslotRoute_1 = require("../../routes/timeslotRoute");
const path = '/timeslots';
const timeslotEndpoints = [
    {
        name: 'timeslots',
        method: 'post',
        path,
        handler: timeslotRoute_1.handleInitTimeslots,
    },
    {
        name: 'timeslots',
        method: 'put',
        path,
        handler: timeslotRoute_1.handleDisableTimeslots,
    },
    {
        name: 'timeslots',
        method: 'get',
        path,
        handler: timeslotRoute_1.handleGetTimeslots,
    },
];
exports.default = timeslotEndpoints;
