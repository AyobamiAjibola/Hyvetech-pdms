import { createSlice } from '@reduxjs/toolkit';
import { IThunkAPIStatus } from '@app-types';
import {
  getCustomerAction,
  getCustomerAppointmentsAction,
  getCustomersAction,
  getCustomerTransactionsAction,
  getCustomerVehiclesAction,
} from '../actions/customerActions';
import { IAppointment, IContact, ICustomer, ITransaction, IVehicle } from '@app-models';

interface ICustomerState {
  getCustomersStatus: IThunkAPIStatus;
  getCustomersSuccess: string;
  getCustomersError?: string;

  getCustomerStatus: IThunkAPIStatus;
  getCustomerSuccess: string;
  getCustomerError?: string;

  getCustomerVehiclesStatus: IThunkAPIStatus;
  getCustomerVehiclesSuccess: string;
  getCustomerVehiclesError?: string;

  getCustomerAppointmentsStatus: IThunkAPIStatus;
  getCustomerAppointmentsSuccess: string;
  getCustomerAppointmentsError?: string;

  getCustomerTransactionsStatus: IThunkAPIStatus;
  getCustomerTransactionsSuccess: string;
  getCustomerTransactionsError?: string;

  contacts: IContact[];
  customers: ICustomer[];
  customer: ICustomer | null;
  vehicles: IVehicle[];
  appointments: IAppointment[];
  transactions: ITransaction[];
}

const initialState: ICustomerState = {
  getCustomersError: '',
  getCustomersSuccess: '',
  getCustomersStatus: 'idle',

  getCustomerError: '',
  getCustomerSuccess: '',
  getCustomerStatus: 'idle',

  getCustomerVehiclesStatus: 'idle',
  getCustomerVehiclesSuccess: '',
  getCustomerVehiclesError: '',

  getCustomerAppointmentsStatus: 'idle',
  getCustomerAppointmentsSuccess: '',
  getCustomerAppointmentsError: '',

  getCustomerTransactionsStatus: 'idle',
  getCustomerTransactionsSuccess: '',
  getCustomerTransactionsError: '',

  contacts: [],
  customers: [],
  customer: null,
  vehicles: [],
  appointments: [],
  transactions: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearGetCustomersStatus(state: ICustomerState) {
      state.getCustomersStatus = 'idle';
      state.getCustomersSuccess = '';
      state.getCustomersError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCustomersAction.pending, state => {
        state.getCustomersStatus = 'loading';
      })
      .addCase(getCustomersAction.fulfilled, (state, action) => {
        state.getCustomersStatus = 'completed';
        state.getCustomersSuccess = action.payload.message;
        state.customers = action.payload.results as ICustomer[];
      })
      .addCase(getCustomersAction.rejected, (state, action) => {
        state.getCustomersStatus = 'failed';
        if (action.payload) {
          state.getCustomersError = action.payload.message;
        } else state.getCustomersError = action.error.message;
      });

    builder
      .addCase(getCustomerAction.pending, state => {
        state.getCustomerStatus = 'loading';
      })
      .addCase(getCustomerAction.fulfilled, (state, action) => {
        state.getCustomerStatus = 'completed';
        state.getCustomerSuccess = action.payload.message;
        state.customer = action.payload.result as ICustomer;
      })
      .addCase(getCustomerAction.rejected, (state, action) => {
        state.getCustomerStatus = 'failed';

        if (action.payload) {
          state.getCustomerError = action.payload.message;
        } else state.getCustomerError = action.error.message;
      });

    builder
      .addCase(getCustomerVehiclesAction.pending, state => {
        state.getCustomerVehiclesStatus = 'loading';
      })
      .addCase(getCustomerVehiclesAction.fulfilled, (state, action) => {
        state.getCustomerVehiclesStatus = 'completed';
        state.getCustomerVehiclesSuccess = action.payload.message;
        state.vehicles = action.payload.results as IVehicle[];
      })
      .addCase(getCustomerVehiclesAction.rejected, (state, action) => {
        state.getCustomerVehiclesStatus = 'failed';

        if (action.payload) {
          state.getCustomerVehiclesError = action.error.message;
        } else state.getCustomerVehiclesError = action.error.message;
      });

    builder
      .addCase(getCustomerAppointmentsAction.pending, state => {
        state.getCustomerAppointmentsStatus = 'loading';
      })
      .addCase(getCustomerAppointmentsAction.fulfilled, (state, action) => {
        state.getCustomerAppointmentsStatus = 'completed';
        state.getCustomerAppointmentsSuccess = action.payload.message;
        state.appointments = action.payload.results as IAppointment[];
      })
      .addCase(getCustomerAppointmentsAction.rejected, (state, action) => {
        state.getCustomerAppointmentsStatus = 'failed';

        if (action.payload) {
          state.getCustomerAppointmentsError = action.payload.message;
        } else state.getCustomerAppointmentsError = action.error.message;
      });

    builder
      .addCase(getCustomerTransactionsAction.pending, state => {
        state.getCustomerTransactionsStatus = 'loading';
      })
      .addCase(getCustomerTransactionsAction.fulfilled, (state, action) => {
        state.getCustomerTransactionsStatus = 'completed';
        state.getCustomerTransactionsSuccess = action.payload.message;
        state.transactions = action.payload.results as ITransaction[];
      })
      .addCase(getCustomerTransactionsAction.rejected, (state, action) => {
        state.getCustomerTransactionsStatus = 'failed';

        if (action.payload) {
          state.getCustomerTransactionsError = action.payload.message;
        } else state.getCustomerTransactionsError = action.error.message;
      });
  },
});

export const { clearGetCustomersStatus } = customerSlice.actions;

export default customerSlice.reducer;
