import { IThunkAPIStatus } from '@app-types';
import { IJob } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import { approveJobCheckListAction, driverAssignJobAction, getJobAction, getJobsAction } from '../actions/jobActions';

interface IJobState {
  getJobsStatus: IThunkAPIStatus;
  getJobsSuccess: string;
  getJobsError?: string;

  getJobStatus: IThunkAPIStatus;
  getJobSuccess: string;
  getJobError?: string;

  driverAssignJobStatus: IThunkAPIStatus;
  driverAssignJobSuccess: string;
  driverAssignJobError?: string;

  approveJobCheckListStatus: IThunkAPIStatus;
  approveJobCheckListSuccess: string;
  approveJobCheckListError?: string;

  jobs: IJob[];
  job: IJob | null;
}

const initialState: IJobState = {
  driverAssignJobError: '',
  driverAssignJobStatus: 'idle',
  driverAssignJobSuccess: '',
  getJobsError: '',
  getJobsStatus: 'idle',
  getJobsSuccess: '',
  getJobError: '',
  getJobStatus: 'idle',
  getJobSuccess: '',
  approveJobCheckListStatus: 'idle',
  approveJobCheckListSuccess: '',
  approveJobCheckListError: '',
  job: null,
  jobs: [],
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearGetJobsStatus(state: IJobState) {
      state.getJobsStatus = 'idle';
      state.getJobsSuccess = '';
      state.getJobsError = '';
    },
    clearGetJobStatus(state: IJobState) {
      state.getJobStatus = 'idle';
      state.getJobSuccess = '';
      state.getJobError = '';
    },
    clearDriverAssignJobStatus(state: IJobState) {
      state.driverAssignJobStatus = 'idle';
      state.driverAssignJobSuccess = '';
      state.driverAssignJobError = '';
    },
    clearApproveJobCheckListStatus(state: IJobState) {
      state.approveJobCheckListStatus = 'idle';
      state.approveJobCheckListSuccess = '';
      state.approveJobCheckListError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getJobsAction.pending, state => {
        state.getJobsStatus = 'loading';
      })
      .addCase(getJobsAction.fulfilled, (state, action) => {
        state.getJobsStatus = 'completed';
        state.getJobsSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(getJobsAction.rejected, (state, action) => {
        state.getJobsStatus = 'failed';

        if (action.payload) {
          state.getJobsError = action.payload.message;
        } else state.getJobsError = action.error.message;
      });

    builder
      .addCase(getJobAction.pending, state => {
        state.getJobStatus = 'loading';
      })
      .addCase(getJobAction.fulfilled, (state, action) => {
        state.getJobStatus = 'completed';
        state.getJobSuccess = action.payload.message;
        state.job = action.payload.result as IJob;
      })
      .addCase(getJobAction.rejected, (state, action) => {
        state.getJobStatus = 'failed';

        if (action.payload) {
          state.getJobError = action.payload.message;
        } else state.getJobError = action.error.message;
      });

    builder
      .addCase(driverAssignJobAction.pending, state => {
        state.driverAssignJobStatus = 'loading';
      })
      .addCase(driverAssignJobAction.fulfilled, (state, action) => {
        state.driverAssignJobStatus = 'completed';
        state.driverAssignJobSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(driverAssignJobAction.rejected, (state, action) => {
        state.driverAssignJobStatus = 'failed';

        if (action.payload) {
          state.driverAssignJobError = action.payload.message;
        } else state.driverAssignJobError = action.error.message;
      });

    builder
      .addCase(approveJobCheckListAction.pending, state => {
        state.approveJobCheckListStatus = 'loading';
      })
      .addCase(approveJobCheckListAction.fulfilled, (state, action) => {
        state.approveJobCheckListStatus = 'completed';
        state.approveJobCheckListSuccess = action.payload.message;
        state.job = action.payload.result as IJob;
      })
      .addCase(approveJobCheckListAction.rejected, (state, action) => {
        state.approveJobCheckListStatus = 'failed';

        if (action.payload) {
          state.approveJobCheckListError = action.payload.message;
        } else state.approveJobCheckListError = action.error.message;
      });
  },
});

export const { clearDriverAssignJobStatus, clearGetJobsStatus, clearGetJobStatus, clearApproveJobCheckListStatus } =
  jobSlice.actions;
export default jobSlice.reducer;
