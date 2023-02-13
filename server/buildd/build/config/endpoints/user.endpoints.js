"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRoute_1 = require("../../routes/userRoute");
const userEndpoints = [
    {
        name: 'users',
        method: 'get',
        path: '/users',
        handler: userRoute_1.getUsersHandler,
    },
    {
        name: 'users',
        method: 'get',
        path: '/users/:userId',
        handler: userRoute_1.getUserHandler,
    },
];
exports.default = userEndpoints;
