import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import {
  createAccountHandler,
  getAccountBalance,
  getAccountTransactions,
  getKycAccountRequest,
  initiateAccountTransfer,
  performAccountActivation,
  performAccountActivationRequest,
  performNameEnquiry,
} from '../../routes/cbaRoute';

const cbaEndpoint: RouteEndpoints = [
  {
    name: 'create-account',
    method: 'post',
    path: '/account/create',
    handler: createAccountHandler,
  },

  {
    name: 'get-account-balance',
    method: 'get',
    path: '/account/balance',
    handler: getAccountBalance,
  },
  {
    name: 'get-account-transactions',
    method: 'get',
    path: '/account/transactions',
    handler: getAccountTransactions,
  },
  {
    name: 'perform-name-enquiry',
    method: 'post',
    path: '/account/enquiry',
    handler: performNameEnquiry,
  },
  {
    name: 'perform-account-activation-request',
    method: 'post',
    path: '/account/request/activation',
    handler: performAccountActivationRequest,
  },
  {
    name: 'perform-account-activation',
    method: 'get',
    path: '/account/request/:id/activate',
    handler: performAccountActivation,
  },
  {
    name: 'perform-account-transfer',
    method: 'post',
    path: '/account/transfer',
    handler: initiateAccountTransfer,
  },
  {
    name: 'perform-account-transfer',
    method: 'get',
    path: '/kyc/requests',
    handler: getKycAccountRequest,
  },
];
export default cbaEndpoint;
