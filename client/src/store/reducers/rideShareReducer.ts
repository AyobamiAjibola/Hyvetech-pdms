import { createSlice } from '@reduxjs/toolkit';
import { IThunkAPIStatus } from '@app-types';
import {
  deleteDriverAction,
  getDriverAction,
  getDriverAppointmentsAction,
  getDriversAction,
  getDriverTransactionsAction,
  getDriverVehiclesAction,
} from '../actions/rideShareActions';
import { IAppointment, IRideShareDriver, ITransaction, IVehicle } from '@app-models';

interface IDriverState {
  getDriverStatus: IThunkAPIStatus;
  getDriverSuccess: string;
  getDriverError?: string;

  deleteDriverStatus: IThunkAPIStatus;
  deleteDriverSuccess: string;
  deleteDriverError?: string;

  getDriversStatus: IThunkAPIStatus;
  getDriversSuccess: string;
  getDriversError?: string;

  getDriverVehiclesStatus: IThunkAPIStatus;
  getDriverVehiclesSuccess: string;
  getDriverVehiclesError?: string;

  getDriverAppointmentsStatus: IThunkAPIStatus;
  getDriverAppointmentsSuccess: string;
  getDriverAppointmentsError?: string;

  getDriverTransactionsStatus: IThunkAPIStatus;
  getDriverTransactionsSuccess: string;
  getDriverTransactionsError?: string;

  driver: IRideShareDriver | null;
  drivers: IRideShareDriver[];
  vehicles: IVehicle[];
  appointments: IAppointment[];
  transactions: ITransaction[];
}

const initialState: IDriverState = {
  getDriverError: '',
  getDriverStatus: 'idle',
  getDriverSuccess: '',

  deleteDriverError: '',
  deleteDriverStatus: 'idle',
  deleteDriverSuccess: '',

  getDriversStatus: 'idle',
  getDriversSuccess: '',
  getDriversError: '',

  getDriverVehiclesStatus: 'idle',
  getDriverVehiclesSuccess: '',
  getDriverVehiclesError: '',

  getDriverAppointmentsStatus: 'idle',
  getDriverAppointmentsSuccess: '',
  getDriverAppointmentsError: '',

  getDriverTransactionsStatus: 'idle',
  getDriverTransactionsSuccess: '',
  getDriverTransactionsError: '',

  driver: null,
  drivers: [],
  transactions: [],
  appointments: [],
  vehicles: [],
};

const rideShareSlice = createSlice({
  name: 'ride_share',
  initialState,
  reducers: {
    clearGetDriverStatus(state: IDriverState) {
      state.getDriverStatus = 'idle';
      state.getDriverSuccess = '';
      state.getDriverError = '';
    },
    clearDeleteDriverStatus(state: IDriverState) {
      state.deleteDriverStatus = 'idle';
      state.deleteDriverSuccess = '';
      state.deleteDriverError = '';
    },
    clearGetDriversStatus(state: IDriverState) {
      state.getDriversStatus = 'idle';
      state.getDriversSuccess = '';
      state.getDriversError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getDriverAction.pending, state => {
        state.getDriverStatus = 'loading';
      })
      .addCase(getDriverAction.fulfilled, (state, action) => {
        state.getDriverStatus = 'completed';
        state.getDriverSuccess = action.payload.message;
        state.driver = action.payload.result as IRideShareDriver;
      })
      .addCase(getDriverAction.rejected, (state, action) => {
        state.getDriverStatus = 'failed';

        if (action.payload) {
          state.getDriverError = action.payload.message;
        } else state.getDriverError = action.error.message;
      });

    builder
      .addCase(deleteDriverAction.pending, state => {
        state.deleteDriverStatus = 'loading';
      })
      .addCase(deleteDriverAction.fulfilled, (state, action) => {
        state.deleteDriverStatus = 'completed';
        state.deleteDriverSuccess = action.payload.message;
      })
      .addCase(deleteDriverAction.rejected, (state, action) => {
        state.deleteDriverStatus = 'failed';

        if (action.payload) {
          state.deleteDriverError = action.payload.message;
        } else state.deleteDriverError = action.error.message;
      });

    builder
      .addCase(getDriversAction.pending, state => {
        state.getDriversStatus = 'loading';
      })
      .addCase(getDriversAction.fulfilled, (state, action) => {
        state.getDriversStatus = 'completed';
        state.getDriversSuccess = action.payload.message;
        state.drivers = action.payload.results as IRideShareDriver[];
      })
      .addCase(getDriversAction.rejected, (state, action) => {
        state.getDriversStatus = 'failed';
        if (action.payload) {
          state.getDriversError = action.payload.message;
        } else state.getDriversError = action.error.message;
      });

    builder
      .addCase(getDriverVehiclesAction.pending, state => {
        state.getDriverVehiclesStatus = 'loading';
      })
      .addCase(getDriverVehiclesAction.fulfilled, (state, action) => {
        state.getDriverVehiclesStatus = 'completed';
        state.getDriverVehiclesSuccess = action.payload.message;
        state.vehicles = action.payload.results as IVehicle[];
      })
      .addCase(getDriverVehiclesAction.rejected, (state, action) => {
        state.getDriverVehiclesStatus = 'failed';

        if (action.payload) {
          state.getDriverVehiclesError = action.error.message;
        } else state.getDriverVehiclesError = action.error.message;
      });

    builder
      .addCase(getDriverAppointmentsAction.pending, state => {
        state.getDriverAppointmentsStatus = 'loading';
      })
      .addCase(getDriverAppointmentsAction.fulfilled, (state, action) => {
        state.getDriverAppointmentsStatus = 'completed';
        state.getDriverAppointmentsSuccess = action.payload.message;
        state.appointments = action.payload.results as IAppointment[];
      })
      .addCase(getDriverAppointmentsAction.rejected, (state, action) => {
        state.getDriverAppointmentsStatus = 'failed';

        if (action.payload) {
          state.getDriverAppointmentsError = action.payload.message;
        } else state.getDriverAppointmentsError = action.error.message;
      });

    builder
      .addCase(getDriverTransactionsAction.pending, state => {
        state.getDriverTransactionsStatus = 'loading';
      })
      .addCase(getDriverTransactionsAction.fulfilled, (state, action) => {
        state.getDriverTransactionsStatus = 'completed';
        state.getDriverTransactionsSuccess = action.payload.message;
        state.transactions = action.payload.results as ITransaction[];
      })
      .addCase(getDriverTransactionsAction.rejected, (state, action) => {
        state.getDriverTransactionsStatus = 'failed';

        if (action.payload) {
          state.getDriverTransactionsError = action.payload.message;
        } else state.getDriverTransactionsError = action.error.message;
      });
  },
});

export const { clearGetDriverStatus, clearDeleteDriverStatus, clearGetDriversStatus } = rideShareSlice.actions;

export default rideShareSlice.reducer;
