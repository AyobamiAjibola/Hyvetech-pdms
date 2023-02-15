"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partnerHandler_1 = require("../../routes/partnerHandler");
const partnerEndpoints = [
    {
        name: 'partners',
        method: 'post',
        path: '/partners',
        handler: partnerHandler_1.createPartnerHandler,
    },
    {
        name: 'partners',
        method: 'patch',
        path: '/partners/:partnerId/kyc',
        handler: partnerHandler_1.createPartnerKycHandler,
    },
    {
        name: 'partners',
        method: 'patch',
        path: '/partners/:partnerId/settings',
        handler: partnerHandler_1.createPartnerSettingsHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners',
        handler: partnerHandler_1.getPartnersHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId',
        handler: partnerHandler_1.getPartnerHandler,
    },
    {
        name: 'partners',
        method: 'post',
        path: '/partners/:partnerId/plans',
        handler: partnerHandler_1.addPlanHandler,
    },
    {
        name: 'partners',
        method: 'post',
        path: '/partners/:partnerId/payment-plans',
        handler: partnerHandler_1.addPaymentPlanHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId/payment-plans',
        handler: partnerHandler_1.getPaymentPlansHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId/plans',
        handler: partnerHandler_1.getPlansHandler,
    },
    {
        name: 'partners',
        method: 'post',
        path: '/partners/:partnerId/filter-drivers',
        handler: partnerHandler_1.filterDriversHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId/drivers-filter-data',
        handler: partnerHandler_1.driversFilterDataHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId/owners-filter-data',
        handler: partnerHandler_1.driversFilterDataHandler,
    },
    {
        name: 'partners',
        method: 'get',
        path: '/partners/:partnerId/jobs',
        handler: partnerHandler_1.partnerJobsHandler,
    },
    {
        name: 'delete plan',
        method: 'delete',
        path: '/partners',
        handler: partnerHandler_1.deletePlanHandler,
    },
    {
        name: 'delete payment plan',
        method: 'delete',
        path: '/partners',
        handler: partnerHandler_1.deletePlanHandler,
    },
    {
        name: 'delete partner',
        method: 'delete',
        path: '/partners/:partnerId',
        handler: partnerHandler_1.deletePartnerHandler,
    },
    {
        name: 'toggle partner',
        method: 'post',
        path: '/partners-toggle/:partnerId',
        handler: partnerHandler_1.togglePartnerHandler,
    },
];
exports.default = partnerEndpoints;
