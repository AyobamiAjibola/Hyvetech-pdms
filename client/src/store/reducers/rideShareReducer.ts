import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import { getDriverAction } from "../actions/rideShareActions";
import { IRideShareDriver } from "@app-models";

interface IDriverState {
  getDriverStatus: IThunkAPIStatus;
  getDriverSuccess: string;
  getDriverError?: string;

  driver: IRideShareDriver | null;
}

const initialState: IDriverState = {
  getDriverError: "",
  getDriverStatus: "idle",
  getDriverSuccess: "",

  driver: null,
};

const rideShareSlice = createSlice({
  name: "ride_share",
  initialState,
  reducers: {
    clearGetDriverStatus(state: IDriverState) {
      state.getDriverStatus = "idle";
      state.getDriverSuccess = "";
      state.getDriverError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDriverAction.pending, (state) => {
        state.getDriverStatus = "loading";
      })
      .addCase(getDriverAction.fulfilled, (state, action) => {
        state.getDriverStatus = "completed";
        state.getDriverSuccess = action.payload.message;
        state.driver = action.payload.result as IRideShareDriver;
      })
      .addCase(getDriverAction.rejected, (state, action) => {
        state.getDriverStatus = "failed";

        if (action.payload) {
          state.getDriverError = action.payload.message;
        } else state.getDriverError = action.error.message;
      });
  },
});

export const { clearGetDriverStatus } = rideShareSlice.actions;

export default rideShareSlice.reducer;
