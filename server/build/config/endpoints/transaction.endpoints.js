"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionRoute_1 = require("../../routes/transactionRoute");
const transactionEndpoints = [
    {
        name: 'transactions',
        method: 'get',
        path: '/transactions',
        handler: transactionRoute_1.txnStatusHandler,
    },
    {
        name: 'deposit for estimate',
        method: 'post',
        path: '/transactions/deposit-for-estimate',
        handler: transactionRoute_1.depositForEstimateHandler,
    },
    {
        name: 'init refund customer',
        method: 'post',
        path: '/transactions/init-refund-customer',
        handler: transactionRoute_1.initRefundCustomerHandler,
    },
    {
        name: 'verify refund customer',
        method: 'get',
        path: '/transactions/verify-refund-customer',
        handler: transactionRoute_1.verifyRefundCustomerHandler,
    },
    {
        name: 'paystack init transaction callback',
        method: 'get',
        path: '/transaction/initialize',
        handler: transactionRoute_1.initTransactionCallbackHandler,
    },
    {
        name: 'update transaction',
        method: 'patch',
        path: '/transactions',
        handler: transactionRoute_1.updateTransactionHandler,
    },
];
exports.default = transactionEndpoints;
