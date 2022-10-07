import { IThunkAPIStatus } from "@app-types";
import { IJob } from "@app-models";
import { createSlice } from "@reduxjs/toolkit";
import { driverAssignJobAction, getJobsAction } from "../actions/jobActions";

interface IJobState {
  getJobsStatus: IThunkAPIStatus;
  getJobsSuccess: string;
  getJobsError?: string;

  driverAssignJobStatus: IThunkAPIStatus;
  driverAssignJobSuccess: string;
  driverAssignJobError?: string;

  jobs: IJob[];
  job: IJob | null;
}

const initialState: IJobState = {
  driverAssignJobError: "",
  driverAssignJobStatus: "idle",
  driverAssignJobSuccess: "",
  getJobsError: "",
  getJobsStatus: "idle",
  getJobsSuccess: "",
  job: null,
  jobs: [],
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearGetJobsStatus(state: IJobState) {
      state.getJobsStatus = "idle";
      state.getJobsSuccess = "";
      state.getJobsError = "";
    },
    clearDriverAssignJobStatus(state: IJobState) {
      state.driverAssignJobStatus = "idle";
      state.driverAssignJobSuccess = "";
      state.driverAssignJobError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobsAction.pending, (state) => {
        state.getJobsStatus = "loading";
      })
      .addCase(getJobsAction.fulfilled, (state, action) => {
        state.getJobsStatus = "completed";
        state.getJobsSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(getJobsAction.rejected, (state, action) => {
        state.getJobsStatus = "failed";

        if (action.payload) {
          state.getJobsError = action.payload.message;
        } else state.getJobsError = action.error.message;
      });

    builder
      .addCase(driverAssignJobAction.pending, (state) => {
        state.driverAssignJobStatus = "loading";
      })
      .addCase(driverAssignJobAction.fulfilled, (state, action) => {
        state.driverAssignJobStatus = "completed";
        state.driverAssignJobSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(driverAssignJobAction.rejected, (state, action) => {
        state.driverAssignJobStatus = "failed";

        if (action.payload) {
          state.driverAssignJobError = action.payload.message;
        } else state.driverAssignJobError = action.error.message;
      });
  },
});

export const { clearDriverAssignJobStatus, clearGetJobsStatus } =
  jobSlice.actions;
export default jobSlice.reducer;