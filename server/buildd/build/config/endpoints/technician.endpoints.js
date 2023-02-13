"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const technicianRoute_1 = require("../../routes/technicianRoute");
const getPath = '/technicians/:techId';
const technicianEndpoints = [
    {
        name: 'create technician',
        method: 'post',
        path: '/technicians',
        handler: technicianRoute_1.createTechnicianHandler,
    },
    {
        name: 'update technician',
        method: 'patch',
        path: getPath,
        handler: technicianRoute_1.updateTechnicianHandler,
    },
    {
        name: 'delete technician',
        method: 'delete',
        path: getPath,
        handler: technicianRoute_1.deleteTechnicianHandler,
    },
    {
        name: 'get technician',
        method: 'get',
        path: getPath,
        handler: technicianRoute_1.getTechnicianHandler,
    },
    {
        name: 'get technicians',
        method: 'get',
        path: '/technicians',
        handler: technicianRoute_1.getTechniciansHandler,
    },
    {
        name: 'get partner technicians',
        method: 'get',
        path: '/technicians/:partnerId/partner',
        handler: technicianRoute_1.getPartnerTechniciansHandler,
    },
    {
        name: 'sign in technician',
        method: 'post',
        path: '/technicians/sign-in',
        handler: technicianRoute_1.signInTechnicianHandler,
    },
];
exports.default = technicianEndpoints;
