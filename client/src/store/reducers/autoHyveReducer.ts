import { createSlice } from '@reduxjs/toolkit';
import { IThunkAPIStatus } from '@app-types';
import {
  getAccountBalanceAction,
  getAccountTransactionsAction,
  getAllBankAction,
  getKycRequestAction,
  initiateAccountTranfer,
  performAccountActivation,
  performNameEnquiryAction,
  requestActivationAction,
  updateCBAccountUpdate,
} from '../actions/autoHyveActions';
import {
  AccountActivateRequest,
  AccountBalanceDTO,
  AccountHolder,
  AccountTransactionsResponseDTO,
  AccountTransferResponseDTO,
  IBank,
} from '@app-models';

interface IAutoHyveStatus {
  requestAccountActivationStatus: IThunkAPIStatus;
  requestAccountActivationSuccess: string;
  requestAccountActivationError?: string;

  activateAccountStatus: IThunkAPIStatus;
  activateAccountSuccess: string;
  activateAccountError?: string;

  performCBAUpdateStatus: IThunkAPIStatus;
  performCBAUpdateSuccess: string;
  performCBAUpdateError?: string;

  getKycRequestStatus: IThunkAPIStatus;
  getKycRequestSuccess: string;
  getKycRequestError?: string;

  requestAccountTransferStatus: IThunkAPIStatus;
  requestAccountTransferSuccess: string;
  requestAccountTransferError?: string;

  requestNameEnquiryStatus: IThunkAPIStatus;
  requestNameEnquirySuccess: string;
  requestNameEnquiryError?: string;

  getAccountBalanceStatus: IThunkAPIStatus;
  getAccountBalanceSuccess: string;
  getAccountBalanceError?: string;

  getAllAccountTransactionStatus: IThunkAPIStatus;
  getAllAccountTransactionSuccess: string;
  getAllAccountTransactionError?: string;

  getAllBankStatus: IThunkAPIStatus;
  getAllBankSuccess: string;
  getAllBankError?: string;

  account: AccountBalanceDTO;

  banks: IBank[];

  transaction: AccountTransactionsResponseDTO;

  accountHolder: AccountHolder;

  accountTranferResponse: AccountTransferResponseDTO;
  accountRequests: AccountActivateRequest[];
}

const initialState: IAutoHyveStatus = {
  requestAccountActivationError: '',
  requestAccountActivationStatus: 'idle',
  requestAccountActivationSuccess: '',

  activateAccountError: '',
  activateAccountStatus: 'idle',
  activateAccountSuccess: '',

  performCBAUpdateError: '',
  performCBAUpdateStatus: 'idle',
  performCBAUpdateSuccess: '',

  getKycRequestError: '',
  getKycRequestStatus: 'idle',
  getKycRequestSuccess: '',

  requestAccountTransferError: '',
  requestAccountTransferStatus: 'idle',
  requestAccountTransferSuccess: '',

  getAccountBalanceError: '',
  getAccountBalanceStatus: 'idle',
  getAccountBalanceSuccess: '',

  requestNameEnquiryError: '',
  requestNameEnquiryStatus: 'idle',
  requestNameEnquirySuccess: '',

  getAllBankError: '',
  getAllBankStatus: 'idle',
  getAllBankSuccess: '',

  account: {
    accountNumber: 'N/A',
    ledgerBalance: 0,
    availableBalance: 0,
    withdrawableBalance: 0,
    accountName: 'Account Number',
    accountProvider: '',
  },

  getAllAccountTransactionError: '',
  getAllAccountTransactionStatus: 'idle',
  getAllAccountTransactionSuccess: '',

  transaction: {
    totalCredit: 0,
    totalDebit: 0,
    totalRecordInStore: 0,
    statusCode: 'N/A',
    postingsHistory: [],
    message: 'N/A',
  },

  banks: [],
  accountHolder: {
    beneficiaryAccountNumber: 'N/A',
    beneficiaryBankCode: 'N/A',
    nameEnquiryID: 'N/A',
    beneficiaryName: '',
    responseCode: '',
    beneficiaryCustomerID: 0,
    senderName: '',
    senderAccountNumber: '',
    sessionID: '',
    transferCharge: 0,
  },

  accountTranferResponse: {
    requestReference: '',
    transactionReference: '',
    responseCode: '',
    status: false,
    message: 'Transaction successful',
    data: null,
  },

  accountRequests: [],
};

const autoHyvePay = createSlice({
  name: 'autoHyve',
  initialState,
  reducers: {
    clearGetDriverStatus(state: IAutoHyveStatus) {
      state.requestAccountActivationStatus = 'idle';
      state.requestAccountActivationSuccess = '';
      state.requestAccountActivationError = '';
    },
    clearAccountHolderDetail(state: IAutoHyveStatus) {
      state.accountHolder = {
        beneficiaryAccountNumber: 'N/A',
        beneficiaryBankCode: 'N/A',
        nameEnquiryID: 'N/A',
        beneficiaryName: '',
        responseCode: '',
        beneficiaryCustomerID: 0,
        senderName: '',
        senderAccountNumber: '',
        sessionID: '',
        transferCharge: 0,
      };
    },
    clearTransferStatus(state: IAutoHyveStatus) {
      state.requestAccountTransferStatus = 'idle';
      state.accountTranferResponse = {
        requestReference: '',
        transactionReference: '',
        responseCode: '',
        status: false,
        message: 'Transaction successful',
        data: null,
      };
    },
    clearCBAUpdateStatus(state: IAutoHyveStatus) {
      state.performCBAUpdateError = '';
      state.performCBAUpdateSuccess = '';
      state.performCBAUpdateStatus = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(requestActivationAction.pending, state => {
        state.requestAccountActivationStatus = 'loading';
      })
      .addCase(requestActivationAction.fulfilled, (state, action) => {
        state.requestAccountActivationStatus = 'completed';
        state.requestAccountActivationSuccess = action.payload.message;
      })
      .addCase(requestActivationAction.rejected, (state, action) => {
        state.requestAccountActivationStatus = 'failed';
        state.requestAccountActivationError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(getAccountBalanceAction.pending, state => {
        state.getAccountBalanceStatus = 'loading';
      })
      .addCase(getAccountBalanceAction.fulfilled, (state, action) => {
        state.getAccountBalanceStatus = 'completed';
        state.account = action.payload.result ? action.payload.result : state.account;
      })
      .addCase(getAccountBalanceAction.rejected, (state, action) => {
        state.getAccountBalanceStatus = 'failed';
        state.getAccountBalanceError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(getAccountTransactionsAction.pending, state => {
        state.getAllAccountTransactionStatus = 'loading';
      })
      .addCase(getAccountTransactionsAction.fulfilled, (state, action) => {
        state.getAllAccountTransactionStatus = 'completed';
        state.transaction = action.payload.result ? action.payload.result : state.transaction;
      })
      .addCase(getAccountTransactionsAction.rejected, (state, action) => {
        state.getAllAccountTransactionStatus = 'failed';
        state.getAllAccountTransactionError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(getAllBankAction.pending, state => {
        state.getAllBankStatus = 'loading';
      })
      .addCase(getAllBankAction.fulfilled, (state, action) => {
        state.getAllBankStatus = 'completed';
        state.banks = action.payload.result ? action.payload.result : state.banks;
      })
      .addCase(getAllBankAction.rejected, (state, action) => {
        state.getAllBankStatus = 'failed';
        state.getAllBankError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(performNameEnquiryAction.pending, state => {
        state.requestNameEnquiryStatus = 'loading';
      })
      .addCase(performNameEnquiryAction.fulfilled, (state, action) => {
        state.requestNameEnquiryStatus = 'completed';
        state.accountHolder = action.payload.result ? action.payload.result : state.accountHolder;
      })
      .addCase(performNameEnquiryAction.rejected, (state, action) => {
        state.requestNameEnquiryStatus = 'failed';
        state.requestNameEnquiryError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(initiateAccountTranfer.pending, state => {
        state.requestAccountTransferStatus = 'loading';
      })
      .addCase(initiateAccountTranfer.fulfilled, (state, action) => {
        state.requestAccountTransferStatus = 'completed';
        state.accountTranferResponse = action.payload.result ? action.payload.result : state.accountTranferResponse;
      })
      .addCase(initiateAccountTranfer.rejected, (state, action) => {
        state.requestAccountTransferStatus = 'failed';
        state.requestAccountTransferError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(getKycRequestAction.pending, state => {
        state.getKycRequestStatus = 'loading';
      })
      .addCase(getKycRequestAction.fulfilled, (state, action) => {
        state.getKycRequestStatus = 'completed';
        state.accountRequests = action.payload.result ? action.payload.result : state.accountRequests;
      })
      .addCase(getKycRequestAction.rejected, (state, action) => {
        console.log('KYCS> ', action);
        state.getKycRequestStatus = 'failed';
        state.getKycRequestError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(performAccountActivation.pending, state => {
        state.activateAccountStatus = 'loading';
      })
      .addCase(performAccountActivation.fulfilled, state => {
        state.activateAccountStatus = 'completed';
      })
      .addCase(performAccountActivation.rejected, (state, action) => {
        state.activateAccountStatus = 'failed';
        state.activateAccountError = action.payload?.message || action.error.message;
      });

    builder
      .addCase(updateCBAccountUpdate.pending, state => {
        state.performCBAUpdateStatus = 'loading';
      })
      .addCase(updateCBAccountUpdate.fulfilled, state => {
        state.performCBAUpdateStatus = 'completed';
      })
      .addCase(updateCBAccountUpdate.rejected, (state, action) => {
        state.performCBAUpdateStatus = 'failed';
        state.performCBAUpdateError = action.payload?.message || action.error.message;
      });
  },
});

export const { clearGetDriverStatus, clearAccountHolderDetail, clearTransferStatus, clearCBAUpdateStatus } =
  autoHyvePay.actions;

export default autoHyvePay.reducer;
