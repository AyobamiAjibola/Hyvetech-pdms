import { IThunkAPIStatus } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getpaymentRecievedAction, initRefundCustomerAction, verifyRefundCustomerAction } from '../actions/transactionActions';
import { IInitTransaction } from '@app-interfaces';

interface ITransactionState {
  initRefundCustomerStatus: IThunkAPIStatus;
  initRefundCustomerSuccess: string;
  initRefundCustomerError: string;

  verifyRefundCustomerStatus: IThunkAPIStatus;
  verifyRefundCustomerSuccess: string;
  verifyRefundCustomerError: string;

  getPaymentRecievedStatus: IThunkAPIStatus;
  getPaymentRecievedSuccess: string;
  getPaymentRecievedError: string;
  paymentRecieve: Array<any>;

  openTransactionPopup: boolean;
  transactionRef: string;
  authorizationUrl: string;

  invoiceId?: number;
}

const initialState: ITransactionState = {
  initRefundCustomerStatus: 'idle',
  initRefundCustomerSuccess: '',
  initRefundCustomerError: '',

  verifyRefundCustomerStatus: 'idle',
  verifyRefundCustomerSuccess: '',
  verifyRefundCustomerError: '',

  getPaymentRecievedStatus: 'idle',
  getPaymentRecievedSuccess: '',
  getPaymentRecievedError: '',
  paymentRecieve: [],

  invoiceId: undefined,
  openTransactionPopup: false,
  transactionRef: '',
  authorizationUrl: '',
};

const transactionSlice = createSlice({
  name: 'txn',
  initialState,
  reducers: {
    resetInitRefundCustomerStatus(state: ITransactionState) {
      state.initRefundCustomerStatus = 'idle';
      state.initRefundCustomerSuccess = '';
      state.initRefundCustomerError = '';
      state.invoiceId = undefined;
    },
    resetPaymentRecieveStatus(state: ITransactionState) {
      state.getPaymentRecievedStatus = 'idle';
      state.getPaymentRecievedSuccess = '';
      state.getPaymentRecievedError = '';
    },
    resetVerifyRefundCustomerStatus(state: ITransactionState) {
      state.verifyRefundCustomerStatus = 'idle';
      state.verifyRefundCustomerSuccess = '';
      state.verifyRefundCustomerError = '';
      state.invoiceId = undefined;
    },
    setOpenTransactionPopup(state: ITransactionState, action: PayloadAction<boolean>) {
      state.openTransactionPopup = action.payload;
    },

    setTransactionRef(state: ITransactionState, action: PayloadAction<string>) {
      state.transactionRef = action.payload;
    },

    setAuthorizationUrl(state: ITransactionState, action: PayloadAction<string>) {
      state.authorizationUrl = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initRefundCustomerAction.pending, state => {
        state.initRefundCustomerStatus = 'loading';
      })
      .addCase(initRefundCustomerAction.fulfilled, (state, action) => {
        state.initRefundCustomerStatus = 'completed';
        state.openTransactionPopup = true;
        const payload = action.payload.result as IInitTransaction;
        state.authorizationUrl = payload.authorizationUrl;
        state.invoiceId = payload.invoiceId;
      })
      .addCase(initRefundCustomerAction.rejected, (state, action) => {
        state.initRefundCustomerStatus = 'failed';

        if (action.payload) state.initRefundCustomerError = action.payload.message;
        else state.initRefundCustomerError = action.error.message as string;
      });

      builder
      .addCase(getpaymentRecievedAction.pending, state => {
        state.getPaymentRecievedStatus = 'loading';
      })
      .addCase(getpaymentRecievedAction.fulfilled, (state, action) => {
        state.getPaymentRecievedStatus = 'completed';
        
        // @ts-ignore
        const payload = action.payload.records;
        
        state.paymentRecieve = payload || [];
      })
      .addCase(getpaymentRecievedAction.rejected, (state, action) => {
        state.getPaymentRecievedStatus = 'failed';

        if (action.payload) state.getPaymentRecievedError = action.payload.message;
        else state.getPaymentRecievedError = action.error.message as string;
      });

    builder
      .addCase(verifyRefundCustomerAction.pending, state => {
        state.verifyRefundCustomerStatus = 'loading';
      })
      .addCase(verifyRefundCustomerAction.fulfilled, (state, action) => {
        state.verifyRefundCustomerStatus = 'completed';
        state.openTransactionPopup = false;
        state.verifyRefundCustomerSuccess = action.payload.message;
      })
      .addCase(verifyRefundCustomerAction.rejected, (state, action) => {
        state.verifyRefundCustomerStatus = 'failed';

        if (action.payload) state.verifyRefundCustomerError = action.payload.message;
        else state.verifyRefundCustomerError = action.error.message as string;
      });
  },
});

export const {
  setAuthorizationUrl,
  setOpenTransactionPopup,
  setTransactionRef,
  resetInitRefundCustomerStatus,
  resetVerifyRefundCustomerStatus,
  resetPaymentRecieveStatus
} = transactionSlice.actions;

export default transactionSlice.reducer;
