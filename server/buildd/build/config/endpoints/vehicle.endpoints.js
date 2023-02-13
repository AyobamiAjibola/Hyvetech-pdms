"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vehicleRoute_1 = require("../../routes/vehicleRoute");
const vehicleEndpoints = [
    {
        name: 'vehicle subscriptions',
        method: 'get',
        path: '/vehicle/:vehicleId/customer-subs',
        handler: vehicleRoute_1.getVehicleSubscriptions,
    },
    {
        name: 'vehicle subscriptions',
        method: 'get',
        path: '/vehicle/:vehicleId/driver-subs',
        handler: vehicleRoute_1.getVehicleSubscriptions,
    },
    {
        name: 'vehicle VIN',
        method: 'get',
        path: '/vehicle',
        handler: vehicleRoute_1.getVehicleVIN,
    },
];
exports.default = vehicleEndpoints;
