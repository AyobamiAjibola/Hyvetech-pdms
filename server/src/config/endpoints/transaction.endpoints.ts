import {
  depositForEstimateHandler,
  generateInvoiceHandler,
  initTransactionCallbackHandler,
  txnStatusHandler,
} from '../../routes/transactionRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const transactionEndpoints: RouteEndpoints = [
  {
    name: 'transactions',
    method: 'get',
    path: '/transactions',
    handler: txnStatusHandler,
  },
  {
    name: 'deposit for estimate',
    method: 'post',
    path: '/transactions/deposit-for-estimate',
    handler: depositForEstimateHandler,
  },
  {
    name: 'paystack init transaction callback',
    method: 'get',
    path: '/transaction/initialize',
    handler: initTransactionCallbackHandler,
  },
  {
    name: 'generate invoice',
    method: 'post',
    path: '/transactions/generate-invoice',
    handler: generateInvoiceHandler,
  },
];

export default transactionEndpoints;
