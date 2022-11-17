import { IThunkAPIStatus } from "@app-types";
import { createSlice } from "@reduxjs/toolkit";
import { createEstimateAction, getEstimatesAction } from "../actions/estimateActions";
import { IEstimate } from "@app-models";

interface IEstimateState {
  createEstimateStatus: IThunkAPIStatus;
  createEstimateSuccess: string;
  createEstimateError?: string;

  getEstimatesStatus: IThunkAPIStatus;
  getEstimatesSuccess: string;
  getEstimatesError?: string;

  estimate: IEstimate | null;
  estimates: IEstimate[];
}

const initialState: IEstimateState = {
  createEstimateError: "",
  createEstimateStatus: "idle",
  createEstimateSuccess: "",
  getEstimatesError: "",
  getEstimatesStatus: "idle",
  getEstimatesSuccess: "",

  estimates: [],
  estimate: null,
};

const estimateSlice = createSlice({
  name: "estimate",
  initialState,
  reducers: {
    clearCreateEstimateStatus(state: IEstimateState) {
      state.createEstimateStatus = "idle";
      state.createEstimateSuccess = "";
      state.createEstimateError = "";
    },
    clearGetEstimateStatus(state: IEstimateState) {
      state.getEstimatesStatus = "idle";
      state.getEstimatesSuccess = "";
      state.getEstimatesError = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createEstimateAction.pending, (state) => {
        state.createEstimateStatus = "loading";
      })
      .addCase(createEstimateAction.fulfilled, (state, action) => {
        state.createEstimateStatus = "completed";
        state.createEstimateSuccess = action.payload.message;

        const newEstimate = action.payload.result as IEstimate;

        state.estimates.push(newEstimate);
      })
      .addCase(createEstimateAction.rejected, (state, action) => {
        state.createEstimateStatus = "failed";

        if (action.payload) {
          state.createEstimateError = action.payload.message;
        } else state.createEstimateError = action.error.message;
      });

    builder
      .addCase(getEstimatesAction.pending, (state) => {
        state.getEstimatesStatus = "loading";
      })
      .addCase(getEstimatesAction.fulfilled, (state, action) => {
        state.getEstimatesStatus = "completed";
        state.getEstimatesSuccess = action.payload.message;
        state.estimates = action.payload.results as IEstimate[];
      })
      .addCase(getEstimatesAction.rejected, (state, action) => {
        state.getEstimatesStatus = "failed";

        if (action.payload) {
          state.getEstimatesError = action.payload.message;
        } else state.getEstimatesError = action.error.message;
      });
  },
});

export const { clearCreateEstimateStatus, clearGetEstimateStatus } = estimateSlice.actions;

export default estimateSlice.reducer;
