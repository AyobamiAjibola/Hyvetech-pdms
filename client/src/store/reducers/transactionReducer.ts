import { IThunkAPIStatus } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initRefundCustomerAction, verifyRefundCustomerAction } from '../actions/transactionActions';
import { IInitTransaction } from '@app-interfaces';

interface ITransactionState {
  initRefundCustomerStatus: IThunkAPIStatus;
  initRefundCustomerSuccess: string;
  initRefundCustomerError: string;

  verifyRefundCustomerStatus: IThunkAPIStatus;
  verifyRefundCustomerSuccess: string;
  verifyRefundCustomerError: string;

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
} = transactionSlice.actions;

export default transactionSlice.reducer;
