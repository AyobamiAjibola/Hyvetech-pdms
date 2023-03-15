import {
  deletePaymentRecieveHandler,
  depositForEstimateHandler,
  getPaymentRecieveHandler,
  initRefundCustomerHandler,
  initTransactionCallbackHandler,
  txnStatusHandler,
  updateTransactionHandler,
  verifyRefundCustomerHandler,
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
    name: 'get payment recieve',
    method: 'get',
    path: '/transactions/payment-recieve',
    handler: getPaymentRecieveHandler,
  },
  {
    name: 'delete payment recieve',
    method: 'post',
    path: '/transactions/delete-single',
    handler: deletePaymentRecieveHandler,
  },
  {
    name: 'deposit for estimate',
    method: 'post',
    path: '/transactions/deposit-for-estimate',
    handler: depositForEstimateHandler,
  },
  {
    name: 'init refund customer',
    method: 'post',
    path: '/transactions/init-refund-customer',
    handler: initRefundCustomerHandler,
  },
  {
    name: 'verify refund customer',
    method: 'get',
    path: '/transactions/verify-refund-customer',
    handler: verifyRefundCustomerHandler,
  },
  {
    name: 'paystack init transaction callback',
    method: 'get',
    path: '/transaction/initialize',
    handler: initTransactionCallbackHandler,
  },

  {
    name: 'update transaction',
    method: 'patch',
    path: '/transactions',
    handler: updateTransactionHandler,
  },
];

export default transactionEndpoints;
