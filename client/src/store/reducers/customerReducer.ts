import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import {
  getCustomerAppointmentsAction,
  getCustomersAction,
  getCustomerTransactionsAction,
  getCustomerVehiclesAction,
} from "../actions/customerActions";
import {
  IAppointment,
  IContact,
  ICustomer,
  ITransaction,
  IVehicle,
} from "@app-models";

interface ICustomerState {
  getCustomersStatus: IThunkAPIStatus;
  getCustomersSuccess: string;
  getCustomersError: string;

  getCustomerVehiclesStatus: IThunkAPIStatus;
  getCustomerVehiclesSuccess: string;
  getCustomerVehiclesError: string;

  getCustomerAppointmentsStatus: IThunkAPIStatus;
  getCustomerAppointmentsSuccess: string;
  getCustomerAppointmentsError: string;

  getCustomerTransactionsStatus: IThunkAPIStatus;
  getCustomerTransactionsSuccess: string;
  getCustomerTransactionsError: string;

  contacts: IContact[];
  customers: ICustomer[];
  vehicles: IVehicle[];
  appointments: IAppointment[];
  transactions: ITransaction[];
}

const initialState: ICustomerState = {
  getCustomersError: "",
  getCustomersSuccess: "",
  getCustomersStatus: "idle",

  getCustomerVehiclesStatus: "idle",
  getCustomerVehiclesSuccess: "",
  getCustomerVehiclesError: "",

  getCustomerAppointmentsStatus: "idle",
  getCustomerAppointmentsSuccess: "",
  getCustomerAppointmentsError: "",

  getCustomerTransactionsStatus: "idle",
  getCustomerTransactionsSuccess: "",
  getCustomerTransactionsError: "",

  contacts: [],
  customers: [],
  vehicles: [],
  appointments: [],
  transactions: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearGetCustomersStatus(state: ICustomerState) {
      state.getCustomersStatus = "idle";
      state.getCustomersSuccess = "";
      state.getCustomersError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomersAction.pending, (state) => {
        state.getCustomersStatus = "loading";
      })
      .addCase(getCustomersAction.fulfilled, (state, action) => {
        state.getCustomersStatus = "completed";
        state.getCustomersSuccess = action.payload.message;
        state.customers = action.payload.results as ICustomer[];
      })
      .addCase(getCustomersAction.rejected, (state, action) => {
        state.getCustomersStatus = "failed";
        state.getCustomersError = <string>action.error.message;
      });

    builder
      .addCase(getCustomerVehiclesAction.pending, (state) => {
        state.getCustomerVehiclesStatus = "loading";
      })
      .addCase(getCustomerVehiclesAction.fulfilled, (state, action) => {
        state.getCustomerVehiclesStatus = "completed";
        state.getCustomerVehiclesSuccess = action.payload.message;
        state.vehicles = action.payload.results as IVehicle[];
      })
      .addCase(getCustomerVehiclesAction.rejected, (state, action) => {
        state.getCustomerVehiclesStatus = "failed";
        state.getCustomerVehiclesError = <string>action.error.message;
      });

    builder
      .addCase(getCustomerAppointmentsAction.pending, (state) => {
        state.getCustomerAppointmentsStatus = "loading";
      })
      .addCase(getCustomerAppointmentsAction.fulfilled, (state, action) => {
        state.getCustomerAppointmentsStatus = "completed";
        state.getCustomerAppointmentsSuccess = action.payload.message;
        state.appointments = action.payload.results as IAppointment[];
      })
      .addCase(getCustomerAppointmentsAction.rejected, (state, action) => {
        state.getCustomerAppointmentsStatus = "failed";
        state.getCustomerAppointmentsError = <string>action.error.message;
      });

    builder
      .addCase(getCustomerTransactionsAction.pending, (state) => {
        state.getCustomerTransactionsStatus = "loading";
      })
      .addCase(getCustomerTransactionsAction.fulfilled, (state, action) => {
        state.getCustomerTransactionsStatus = "completed";
        state.getCustomerTransactionsSuccess = action.payload.message;
        state.transactions = action.payload.results as ITransaction[];
      })
      .addCase(getCustomerTransactionsAction.rejected, (state, action) => {
        state.getCustomerTransactionsStatus = "failed";
        state.getCustomerTransactionsError = <string>action.error.message;
      });
  },
});

export const { clearGetCustomersStatus } = customerSlice.actions;

export default customerSlice.reducer;
