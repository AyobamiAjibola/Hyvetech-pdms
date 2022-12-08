import { IThunkAPIStatus } from '@app-types';
import { IInvoice } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import { getInvoicesAction } from '../actions/invoiceActions';

interface IInvoiceState {
  getInvoicesStatus: IThunkAPIStatus;
  getInvoicesSuccess: string;
  getInvoicesError: string;

  invoices: IInvoice[];
  invoice: IInvoice | undefined;
}

const initialState: IInvoiceState = {
  getInvoicesStatus: 'idle',
  getInvoicesSuccess: '',
  getInvoicesError: '',

  invoice: undefined,
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearGetInvoicesStatus(state: IInvoiceState) {
      state.getInvoicesStatus = 'idle';
      state.getInvoicesSuccess = '';
      state.getInvoicesError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getInvoicesAction.pending, state => {
        state.getInvoicesStatus = 'loading';
      })
      .addCase(getInvoicesAction.fulfilled, (state, action) => {
        state.getInvoicesStatus = 'completed';
        state.getInvoicesSuccess = action.payload.message;
        state.invoices = action.payload.results as IInvoice[];
      })
      .addCase(getInvoicesAction.rejected, (state, action) => {
        state.getInvoicesStatus = 'failed';

        if (action.payload) {
          state.getInvoicesError = action.payload.message;
        } else state.getInvoicesError = action.error.message as string;
      });
  },
});

export const { clearGetInvoicesStatus } = invoiceSlice.actions;

export default invoiceSlice.reducer;
