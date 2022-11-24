import { IThunkAPIStatus } from '@app-types';
import { IJob } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import {
  approveJobCheckListAction,
  cancelJobAction,
  driverAssignJobAction,
  getJobAction,
  getJobsAction,
  reassignJobAction,
  uploadJobReportAction,
} from '../actions/jobActions';

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

  uploadJobReportStatus: IThunkAPIStatus;
  uploadJobReportSuccess: string;
  uploadJobReportError?: string;

  reassignJobStatus: IThunkAPIStatus;
  reassignJobSuccess: string;
  reassignJobError?: string;

  cancelJobStatus: IThunkAPIStatus;
  cancelJobSuccess: string;
  cancelJobError?: string;

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

  uploadJobReportError: '',
  uploadJobReportStatus: 'idle',
  uploadJobReportSuccess: '',

  cancelJobError: '',
  cancelJobStatus: 'idle',
  cancelJobSuccess: '',

  reassignJobError: '',
  reassignJobStatus: 'idle',
  reassignJobSuccess: '',

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

    clearCancelJobStatus(state: IJobState) {
      state.cancelJobStatus = 'idle';
      state.cancelJobSuccess = '';
      state.cancelJobError = '';
    },

    clearReassignJobStatus(state: IJobState) {
      state.reassignJobStatus = 'idle';
      state.reassignJobSuccess = '';
      state.reassignJobError = '';
    },
    clearApproveJobCheckListStatus(state: IJobState) {
      state.approveJobCheckListStatus = 'idle';
      state.approveJobCheckListSuccess = '';
      state.approveJobCheckListError = '';
    },
    clearUploadJobReportStatus(state: IJobState) {
      state.uploadJobReportStatus = 'idle';
      state.uploadJobReportSuccess = '';
      state.uploadJobReportError = '';
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
      .addCase(cancelJobAction.pending, state => {
        state.cancelJobStatus = 'loading';
      })
      .addCase(cancelJobAction.fulfilled, (state, action) => {
        state.cancelJobStatus = 'completed';
        state.cancelJobSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(cancelJobAction.rejected, (state, action) => {
        state.cancelJobStatus = 'failed';

        if (action.payload) {
          state.cancelJobError = action.payload.message;
        } else state.cancelJobError = action.error.message;
      });

    builder
      .addCase(reassignJobAction.pending, state => {
        state.reassignJobStatus = 'loading';
      })
      .addCase(reassignJobAction.fulfilled, (state, action) => {
        state.reassignJobStatus = 'completed';
        state.reassignJobSuccess = action.payload.message;
        state.jobs = action.payload.results as IJob[];
      })
      .addCase(reassignJobAction.rejected, (state, action) => {
        state.reassignJobStatus = 'failed';

        if (action.payload) {
          state.reassignJobError = action.payload.message;
        } else state.reassignJobError = action.error.message;
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

    builder
      .addCase(uploadJobReportAction.pending, state => {
        state.uploadJobReportStatus = 'loading';
      })
      .addCase(uploadJobReportAction.fulfilled, (state, action) => {
        state.uploadJobReportStatus = 'completed';
        state.uploadJobReportSuccess = action.payload.message;
      })
      .addCase(uploadJobReportAction.rejected, (state, action) => {
        state.uploadJobReportStatus = 'failed';

        if (action.payload) {
          state.uploadJobReportError = action.payload.message;
        } else state.uploadJobReportError = action.error.message;
      });
  },
});

export const {
  clearDriverAssignJobStatus,
  clearGetJobsStatus,
  clearGetJobStatus,
  clearApproveJobCheckListStatus,
  clearCancelJobStatus,
  clearReassignJobStatus,
  clearUploadJobReportStatus,
} = jobSlice.actions;
export default jobSlice.reducer;
