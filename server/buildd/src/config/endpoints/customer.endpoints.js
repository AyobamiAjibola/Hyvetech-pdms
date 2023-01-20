"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerRoute_1 = require("../../routes/customerRoute");
const customerEndpoints = [
    {
        name: 'customer',
        method: 'get',
        path: '/customers',
        handler: customerRoute_1.getCustomersHandler,
    },
    {
        name: 'customer',
        method: 'get',
        path: '/customer/:customerId',
        handler: customerRoute_1.getCustomerHandler,
    },
    {
        name: 'customer',
        method: 'get',
        path: '/customers/:customerId/vehicles',
        handler: customerRoute_1.getCustomerVehiclesHandler,
    },
    {
        name: 'customer',
        method: 'get',
        path: '/customers/:customerId/appointments',
        handler: customerRoute_1.getCustomerAppointmentsHandler,
    },
    {
        name: 'customer',
        method: 'get',
        path: '/customers/:customerId/transactions',
        handler: customerRoute_1.getCustomerTransactionsHandler,
    },
    {
        name: 'suggest workshop',
        method: 'post',
        path: '/customers/:customerId/workshops',
        handler: customerRoute_1.suggestWorkshopHandler,
    },
];
exports.default = customerEndpoints;
