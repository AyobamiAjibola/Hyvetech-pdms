import {
  AccountActivateRequest,
  AccountBalanceDTO,
  AccountHolder,
  AccountTransactionsResponseDTO,
  AccountTransferDTO,
  AccountTransferResponseDTO,
  IBank,
  UploadResult,
  VirtualAccountsDTO,
} from "@app-models";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import { ApiResponseSuccess } from "@app-interfaces";
const API_ROOT = settings.api.rest;

const ACTIVATION_REQUEST = "autoHyvePay:ACTIVATION_REQUEST";
const ACCOUNT_BALANCE = "autoHyvePay:ACCOUNT_BALANCE";
const ACCOUNT_TRANSACTIONS = "autoHyvePay:ACCOUNT_TRANSACTIONS";
const PERFORM_NAME_ENQUIRY = "autoHyvePay:PERFORM_NAME_ENQUIRY";
const PERFORM_ACCOUNT_TRANSFER = "autoHyvePay:PERFORM_ACCOUNT_TRANSFER";
const GET_KYC_REQUESTS = "autoHyvePay:GET_KYC_REQUESTS";
const ACTIVATE_ACCOUNT = "autoHyvePay:ACTIVATE_ACCOUNT";
const PERFORM_CBA_ACCOUNT_UPDATE = "autoHyvePay:PERFORM_CBA_ACCOUNT_UPDATE";
const ACTIVATE_ACCOUNT_REJECTION = "autoHyvePay:ACTIVATE_ACCOUNT_REJECTION";
const VIRTUAL_ACCOUNTS = "autoHyvePay:VIRTUAL_ACCOUNTS";
const ACCOUNT_TRANSACTIONS_FILTERED = "autoHyvePay:ACCOUNT_TRANSACTIONS_FILTERED";
const MAIN_ACCOUNT_TRANSACTION_LOGS = "autoHyvePay:MAIN_ACCOUNT_TRANSACTION_LOGS";

const BANKS = "autoHyvePay:BANKS";

export const uploadFile = async (payload: FormData) => {
  const response = await axiosClient.post(`${API_ROOT}/upload/file`, payload);

  return response.data as UploadResult;
};

export const requestActivationAction = asyncThunkWrapper<
  ApiResponseSuccess<string>,
  any
>(ACTIVATION_REQUEST, async (args: any) => {
  const response = await axiosClient.post(
    `${API_ROOT}/account/request/activation`,
    args
  );

  return response.data;
});

export const getAccountBalanceAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountBalanceDTO>,
  void
>(ACCOUNT_BALANCE, async () => {
  const response = await axiosClient.get(`${API_ROOT}/account/balance`);

  return response.data;
});
// /account/enquiry

export const performNameEnquiryAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountHolder>,
  {
    beneficiaryBankCode: string;
    beneficiaryAccountNumber: string;
  }
>(
  PERFORM_NAME_ENQUIRY,
  async (args: {
    beneficiaryBankCode: string;
    beneficiaryAccountNumber: string;
  }) => {
    const response = await axiosClient.post(
      `${API_ROOT}/account/enquiry`,
      args
    );

    return response.data;
  }
);

export const getAccountTransactionsAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountTransactionsResponseDTO>,
  { startDate: string; endDate: string } | void
>(
  ACCOUNT_TRANSACTIONS,
  async (args: { startDate: string; endDate: string } | void) => {
    const response = await axiosClient.get(
      args
        ? `${API_ROOT}/account/transactions?startDate=${args.startDate}&endDate=${args.endDate}`
        : `${API_ROOT}/account/transactions`
    );

    return response.data;
  }
);

export const getMainAccountTransactionLogsAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountTransactionsResponseDTO>,
  { startDate?: string; endDate?: string } | void
>(
  MAIN_ACCOUNT_TRANSACTION_LOGS,
  async (args: any) => {
    let response;
    if(args.startDate !== "" || args.endDate !== "") {
      response = await axiosClient.post(
        `${API_ROOT}/account/main/transactions`,
        {startDate: args.startDate, endDate: args.endDate}
      );
    } else {
      response = await axiosClient.post(
        `${API_ROOT}/account/main/transactions`
      );
    }

    return response.data;
  }
);

export const getAccountTransactionsFilteredAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountTransactionsResponseDTO>,
  { startDate?: string; endDate?: string; accountRef: string } | void
>(
  ACCOUNT_TRANSACTIONS_FILTERED,
  async (args: any) => {
    const response = await axiosClient.post(
      args.startDate && args.endDate
        ? `${API_ROOT}/account/transactions/filtered?startDate=${args.startDate}&endDate=${args.endDate}`
        : `${API_ROOT}/account/transactions/filtered`,
        {accountRef: args.accountRef}
    );

    return response.data;
  }
);

export const getVirtualAccountsAction = asyncThunkWrapper<
  ApiResponseSuccess<VirtualAccountsDTO>,
  { startDate: string; endDate: string } | void
>(
  VIRTUAL_ACCOUNTS,
  async (args: { startDate: string; endDate: string } | void) => {
    const response = await axiosClient.get(
      args
        ? `${API_ROOT}/virtual/accounts?startDate=${args.startDate}&endDate=${args.endDate}`
        : `${API_ROOT}/virtual/accounts`
    );

    return response.data;
  }
);

export const getAllBankAction = asyncThunkWrapper<
  ApiResponseSuccess<IBank[]>,
  void
>(BANKS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/banks`);

  return response.data;
});

export const getKycRequestAction = asyncThunkWrapper<
  ApiResponseSuccess<AccountActivateRequest[]>,
  void
>(GET_KYC_REQUESTS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/kyc/requests`);

  return response.data;
});

export const performAccountActivation = asyncThunkWrapper<
  ApiResponseSuccess<any>,
  string
>(ACTIVATE_ACCOUNT, async (args) => {
  const response = await axiosClient.get(
    `${API_ROOT}/account/request/${args}/activate`
  );

  return response.data;
});

export const performAccountActivatioRejection = asyncThunkWrapper<
  ApiResponseSuccess<any>,
  string
>(ACTIVATE_ACCOUNT_REJECTION, async (args) => {
  const response = await axiosClient.get(
    `${API_ROOT}/account/request/${args}/decline-activation`
  );

  return response.data;
});

export const initiateAccountTranfer = asyncThunkWrapper<
  ApiResponseSuccess<AccountTransferResponseDTO>,
  AccountTransferDTO
>(PERFORM_ACCOUNT_TRANSFER, async (args: AccountTransferDTO) => {
  const response = await axiosClient.post(`${API_ROOT}/account/transfer`, args);

  return response.data;
});

export const updateCBAccountUpdate = asyncThunkWrapper<
  ApiResponseSuccess<any>,
  { pin: string; currentPin: string }
>(PERFORM_CBA_ACCOUNT_UPDATE, async (args: { pin: string }) => {
  const response = await axiosClient.post(
    `${API_ROOT}/cba/account/pin/update`,
    args
  );

  return response.data;
});
