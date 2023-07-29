import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import {
  createAccountHandler,
  createBeneficiary,
  getAccountBalance,
  getAccountTransactions,
  getKycAccountRequest,
  getMainAccountTransactions,
  initiateAccountTransfer,
  performAccountActivation,
  performAccountActivationRejection,
  performAccountActivationRequest,
  performAccountPinUpdate,
  performAccountUpdate,
  performNameEnquiry,
} from "../../routes/cbaRoute";

const cbaEndpoint: RouteEndpoints = [
  {
    name: "create-account",
    method: "post",
    path: "/account/create",
    handler: createAccountHandler,
  },

  {
    name: "get-account-balance",
    method: "get",
    path: "/account/balance",
    handler: getAccountBalance,
  },
  {
    name: "get-account-transactions",
    method: "get",
    path: "/account/transactions",
    handler: getAccountTransactions,
  },
  {
    name: "get-main-account-transactions",
    method: "post",
    path: "/account/main/transactions",
    handler: getMainAccountTransactions,
  },
  {
    name: "perform-name-enquiry",
    method: "post",
    path: "/account/enquiry",
    handler: performNameEnquiry,
  },
  {
    name: "perform-account-activation-request",
    method: "post",
    path: "/account/request/activation",
    handler: performAccountActivationRequest,
  },
  {
    name: "perform-account-activation",
    method: "get",
    path: "/account/request/:id/activate",
    handler: performAccountActivation,
  },
  {
    name: "perform-account-activation-rejection",
    method: "get",
    path: "/account/request/:id/decline-activation",
    handler: performAccountActivationRejection,
  },
  {
    name: "perform-account-transfer",
    method: "post",
    path: "/account/transfer",
    handler: initiateAccountTransfer,
  },
  {
    name: "add-beneficiary",
    method: "post",
    path: "/beneficary/add",
    handler: createBeneficiary,
  },
  {
    name: "perform-account-transfer",
    method: "get",
    path: "/kyc/requests",
    handler: getKycAccountRequest,
  },

  {
    name: "perform-account-pin-update",
    method: "post",
    path: "/cba/account/pin/update",
    handler: performAccountPinUpdate,
  },

  {
    name: "perform-account-update",
    method: "post",
    path: "/cba/account/update",
    handler: performAccountUpdate,
  },
];
export default cbaEndpoint;
