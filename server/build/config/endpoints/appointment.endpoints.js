"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appointmentRoute_1 = require("../../routes/appointmentRoute");
const appointmentEndpoints = [
    {
        name: 'appointments',
        method: 'get',
        path: '/appointments',
        handler: appointmentRoute_1.getAppointmentsHandler,
    },
    {
        name: 'appointments',
        method: 'get',
        path: '/appointments/:appointmentId',
        handler: appointmentRoute_1.getAppointmentHandler,
    },
    {
        name: 'appointments',
        method: 'post',
        path: '/appointments',
        handler: appointmentRoute_1.createAppointmentHandler,
    },
    {
        name: 'appointments',
        method: 'patch',
        path: '/appointments/:appointmentId',
        handler: appointmentRoute_1.updateAppointmentHandler,
    },
    {
        name: 'appointments',
        method: 'patch',
        path: '/appointments/:appointmentId/cancel',
        handler: appointmentRoute_1.cancelAppointmentHandler,
    },
    {
        name: 'appointments',
        method: 'patch',
        path: '/appointments/:appointmentId/reschedule',
        handler: appointmentRoute_1.rescheduleAppointmentHandler,
    },
];
exports.default = appointmentEndpoints;
