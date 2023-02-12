"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const miscellaneousHandler_1 = require("../../routes/miscellaneousHandler");
const miscellaneousEndpoints = [
    {
        name: 'states and districts',
        method: 'get',
        path: '/states',
        handler: miscellaneousHandler_1.statesAndDistrictsHandler,
    },
    {
        name: 'paystack banks',
        method: 'get',
        path: '/paystack/banks',
        handler: miscellaneousHandler_1.payStackBanksHandler,
    },
];
exports.default = miscellaneousEndpoints;
