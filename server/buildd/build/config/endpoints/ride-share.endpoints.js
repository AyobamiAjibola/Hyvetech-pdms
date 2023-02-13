"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rideShareRoute_1 = require("../../routes/rideShareRoute");
const rideShareEndpoints = [
    {
        name: 'ride share driver',
        method: 'get',
        path: '/ride-share/:driverId/driver',
        handler: rideShareRoute_1.getDriverHandler,
    },
    {
        name: 'ride share drivers',
        method: 'get',
        path: '/ride-share',
        handler: rideShareRoute_1.getRideShareDriversHandler,
    },
    {
        name: 'ride share driver by id',
        method: 'get',
        path: '/ride-share/:driverId',
        handler: rideShareRoute_1.getRideShareDriverHandler,
    },
    {
        name: 'ride share driver vehicles',
        method: 'get',
        path: '/ride-share/:driverId/vehicles',
        handler: rideShareRoute_1.getRideShareDriverVehiclesHandler,
    },
    {
        name: 'ride share driver appointments',
        method: 'get',
        path: '/ride-share/:driverId/appointments',
        handler: rideShareRoute_1.getRideShareDriverAppointmentsHandler,
    },
    {
        name: 'ride share driver transactions',
        method: 'get',
        path: '/ride-share/:driverId/transactions',
        handler: rideShareRoute_1.getRideShareDriverTransactionsHandler,
    },
    {
        name: 'delete ride share driver',
        method: 'delete',
        path: '/ride-share/:driverId',
        handler: rideShareRoute_1.deleteRideShareDriverHandler,
    },
];
exports.default = rideShareEndpoints;
