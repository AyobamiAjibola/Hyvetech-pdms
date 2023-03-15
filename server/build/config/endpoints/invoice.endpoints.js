"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoiceRoute_1 = require("../../routes/invoiceRoute");
const invoiceEndpoints = [
    {
        name: 'complete estimate deposit',
        method: 'post',
        path: '/transactions/complete-estimate-deposit',
        handler: invoiceRoute_1.completeEstimateDepositHandler,
    },
    {
        name: 'generate invoice',
        method: 'post',
        path: '/transactions/generate-invoice',
        handler: invoiceRoute_1.generateInvoiceHandler,
    },
    {
        name: 'generate invoice manually',
        method: 'post',
        path: '/transactions/generate-invoice-manually',
        handler: invoiceRoute_1.generateInvoiceManuallyHandler,
    },
    {
        name: 'update completed invoice payment',
        method: 'patch',
        path: '/transactions/update-completed-invoice-payment',
        handler: invoiceRoute_1.updateCompletedInvoicePaymentHandler,
    },
    {
        name: 'update completed invoice payment manually',
        method: 'post',
        path: '/transactions/update-invoice-payment-manually',
        handler: invoiceRoute_1.updateCompletedInvoicePaymentManuallyHandler,
    },
    {
        name: 'get invoices',
        method: 'get',
        path: '/invoices',
        handler: invoiceRoute_1.getInvoicesHandler,
    },
    {
        name: 'save invoice',
        method: 'patch',
        path: '/invoices/save',
        handler: invoiceRoute_1.saveInvoiceHandler,
    },
    {
        name: 'send invoice',
        method: 'patch',
        path: '/invoices/send',
        handler: invoiceRoute_1.sendInvoiceHandler,
    },
];
exports.default = invoiceEndpoints;
