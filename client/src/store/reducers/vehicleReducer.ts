import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import {
  ICustomerSubscription,
  IRideShareDriverSubscription,
} from "@app-models";

import {
  getCustomerVehicleSubscriptionAction,
  getDriverVehicleSubscriptionAction,
} from "../actions/vehicleActions";

interface IVehicleState {
  getDriverVehicleSubscriptionStatus: IThunkAPIStatus;
  getDriverVehicleSubscriptionSuccess: string;
  getDriverVehicleSubscriptionError?: string;

  getCustomerVehicleSubscriptionStatus: IThunkAPIStatus;
  getCustomerVehicleSubscriptionSuccess: string;
  getCustomerVehicleSubscriptionError?: string;

  driverSubscriptions: IRideShareDriverSubscription[];
  customerSubscriptions: ICustomerSubscription[];
}

const initialState: IVehicleState = {
  customerSubscriptions: [],
  driverSubscriptions: [],
  getCustomerVehicleSubscriptionError: "",
  getCustomerVehicleSubscriptionStatus: "idle",
  getCustomerVehicleSubscriptionSuccess: "",
  getDriverVehicleSubscriptionError: "",
  getDriverVehicleSubscriptionStatus: "idle",
  getDriverVehicleSubscriptionSuccess: "",
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    clearGetDriverVehicleSubscriptionStatus(state: IVehicleState) {
      state.getDriverVehicleSubscriptionStatus = "idle";
      state.getDriverVehicleSubscriptionSuccess = "";
      state.getDriverVehicleSubscriptionError = "";
    },
    clearGetCustomerVehicleSubscriptionStatus(state: IVehicleState) {
      state.getCustomerVehicleSubscriptionStatus = "idle";
      state.getCustomerVehicleSubscriptionSuccess = "";
      state.getCustomerVehicleSubscriptionError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerVehicleSubscriptionAction.pending, (state) => {
        state.getCustomerVehicleSubscriptionStatus = "loading";
      })
      .addCase(
        getCustomerVehicleSubscriptionAction.fulfilled,
        (state, action) => {
          state.getCustomerVehicleSubscriptionStatus = "completed";
          state.customerSubscriptions = action.payload
            .results as ICustomerSubscription[];
        }
      )
      .addCase(
        getCustomerVehicleSubscriptionAction.rejected,
        (state, action) => {
          state.getCustomerVehicleSubscriptionStatus = "failed";
          if (action.payload) {
            state.getCustomerVehicleSubscriptionError = action.payload.message;
          } else
            state.getCustomerVehicleSubscriptionError = action.error.message;
        }
      );

    builder
      .addCase(getDriverVehicleSubscriptionAction.pending, (state) => {
        state.getDriverVehicleSubscriptionStatus = "loading";
      })
      .addCase(
        getDriverVehicleSubscriptionAction.fulfilled,
        (state, action) => {
          state.getDriverVehicleSubscriptionStatus = "completed";
          state.driverSubscriptions = action.payload
            .results as IRideShareDriverSubscription[];
        }
      )
      .addCase(getDriverVehicleSubscriptionAction.rejected, (state, action) => {
        state.getDriverVehicleSubscriptionStatus = "failed";
        if (action.payload) {
          state.getDriverVehicleSubscriptionError = action.payload.message;
        } else state.getDriverVehicleSubscriptionError = action.error.message;
      });
  },
});

export const {
  clearGetCustomerVehicleSubscriptionStatus,
  clearGetDriverVehicleSubscriptionStatus,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
