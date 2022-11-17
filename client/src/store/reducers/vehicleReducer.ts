import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import { ICustomerSubscription, IRideShareDriverSubscription } from "@app-models";

import {
  getCustomerVehicleSubscriptionAction,
  getDriverVehicleSubscriptionAction,
  getVehicleVINAction,
} from "../actions/vehicleActions";
import { IVINDecoderSchema } from "@app-interfaces";

interface IVehicleState {
  getDriverVehicleSubscriptionStatus: IThunkAPIStatus;
  getDriverVehicleSubscriptionSuccess: string;
  getDriverVehicleSubscriptionError?: string;

  getCustomerVehicleSubscriptionStatus: IThunkAPIStatus;
  getCustomerVehicleSubscriptionSuccess: string;
  getCustomerVehicleSubscriptionError?: string;

  getVehicleVINStatus: IThunkAPIStatus;
  getVehicleVINError?: string;

  driverSubscriptions: IRideShareDriverSubscription[];
  customerSubscriptions: ICustomerSubscription[];
  vehicleVINDetails: Array<IVINDecoderSchema>;
}

const initialState: IVehicleState = {
  getVehicleVINError: "",
  getVehicleVINStatus: "idle",
  vehicleVINDetails: [],
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
    clearGetVehicleVINStatus(state) {
      state.getVehicleVINStatus = "idle";
      state.getVehicleVINError = "";
      state.vehicleVINDetails = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerVehicleSubscriptionAction.pending, (state) => {
        state.getCustomerVehicleSubscriptionStatus = "loading";
      })
      .addCase(getCustomerVehicleSubscriptionAction.fulfilled, (state, action) => {
        state.getCustomerVehicleSubscriptionStatus = "completed";
        state.customerSubscriptions = action.payload.results as ICustomerSubscription[];
      })
      .addCase(getCustomerVehicleSubscriptionAction.rejected, (state, action) => {
        state.getCustomerVehicleSubscriptionStatus = "failed";
        if (action.payload) {
          state.getCustomerVehicleSubscriptionError = action.payload.message;
        } else state.getCustomerVehicleSubscriptionError = action.error.message;
      });

    builder
      .addCase(getDriverVehicleSubscriptionAction.pending, (state) => {
        state.getDriverVehicleSubscriptionStatus = "loading";
      })
      .addCase(getDriverVehicleSubscriptionAction.fulfilled, (state, action) => {
        state.getDriverVehicleSubscriptionStatus = "completed";
        state.driverSubscriptions = action.payload.results as IRideShareDriverSubscription[];
      })
      .addCase(getDriverVehicleSubscriptionAction.rejected, (state, action) => {
        state.getDriverVehicleSubscriptionStatus = "failed";
        if (action.payload) {
          state.getDriverVehicleSubscriptionError = action.payload.message;
        } else state.getDriverVehicleSubscriptionError = action.error.message;
      });

    builder
      .addCase(getVehicleVINAction.pending, (state) => {
        state.getVehicleVINStatus = "loading";
      })
      .addCase(getVehicleVINAction.fulfilled, (state, action) => {
        state.getVehicleVINStatus = "completed";
        state.vehicleVINDetails = action.payload.results as IVINDecoderSchema[];
      })
      .addCase(getVehicleVINAction.rejected, (state, action) => {
        state.getVehicleVINStatus = "failed";

        if (action.payload) {
          state.getVehicleVINError = action.payload.message;
        } else state.getVehicleVINError = action.error.message;
      });
  },
});

export const {
  clearGetCustomerVehicleSubscriptionStatus,
  clearGetDriverVehicleSubscriptionStatus,
  clearGetVehicleVINStatus,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
