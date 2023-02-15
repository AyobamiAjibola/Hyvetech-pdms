"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = require("../../routes/authRoute");
const authEndpoints = [
    {
        name: 'signIn',
        method: 'post',
        path: '/sign-in',
        handler: authRoute_1.signInHandler,
    },
    {
        name: 'signUp',
        method: 'post',
        path: '/sign-up',
        handler: authRoute_1.signupHandler,
    },
    {
        name: 'Garage signUp',
        method: 'post',
        path: '/garage-sign-up',
        handler: authRoute_1.garageSignUpHandler,
    },
    {
        name: 'signOut',
        method: 'get',
        path: '/sign-out',
        handler: authRoute_1.signOutHandler,
    },
    {
        name: 'bootstrap',
        method: 'get',
        path: '/bootstrap',
        handler: authRoute_1.bootstrapHandler,
    },
];
exports.default = authEndpoints;
