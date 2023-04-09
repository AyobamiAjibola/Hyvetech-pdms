import { createSlice } from '@reduxjs/toolkit';
import { IThunkAPIStatus } from '@app-types';
import { getAnalyticsAction, getSuperAnalyticsAction, getTechAnalyticsAction } from '../actions/dashboardActions';
import { IDashboardData } from '@app-interfaces';

interface IDashboardState {
  getAnalyticsStatus: IThunkAPIStatus;
  getAnalyticsSuccess: string;
  getAnalyticsError: string;
  analytics: IDashboardData | null;

  getTechAnalyticsStatus: IThunkAPIStatus;
  getTechAnalyticsSuccess: string;
  getTechAnalyticsError: string;
  techAnalytics: any | null;

  getSuperAnalyticsStatus: IThunkAPIStatus;
  getSuperAnalyticsSuccess: string;
  getSuperAnalyticsError: string;
  superAnalytics: any | null;

  stackedMonthlyData: { name: string; data: number[] }[];
}

const initialState: IDashboardState = {
  getAnalyticsError: '',
  getAnalyticsSuccess: '',
  getAnalyticsStatus: 'idle',
  analytics: null,

  getTechAnalyticsStatus: 'idle',
  getTechAnalyticsSuccess: '',
  getTechAnalyticsError: '',
  techAnalytics: null,

  getSuperAnalyticsStatus: 'idle',
  getSuperAnalyticsSuccess: '',
  getSuperAnalyticsError: '',
  superAnalytics: null,

  stackedMonthlyData: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearGetAnalyticsStatus(state: IDashboardState) {
      state.getAnalyticsStatus = 'idle';
      state.getAnalyticsSuccess = '';
      state.getAnalyticsError = '';
    },
    clearGetTechAnalyticsStatus(state: IDashboardState) {
      state.getTechAnalyticsStatus = 'idle';
      state.getTechAnalyticsSuccess = '';
      state.getTechAnalyticsError = '';
    },
    clearGetSuperAnalyticsStatus(state: IDashboardState) {
      state.getSuperAnalyticsStatus = 'idle';
      state.getSuperAnalyticsSuccess = '';
      state.getSuperAnalyticsError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAnalyticsAction.pending, state => {
        state.getAnalyticsStatus = 'loading';
      })
      .addCase(getAnalyticsAction.fulfilled, (state, action) => {
        state.getAnalyticsStatus = 'completed';
        state.getAnalyticsSuccess = action.payload.message;
        state.analytics = action.payload.result;
      })
      .addCase(getAnalyticsAction.rejected, (state, action) => {
        state.getAnalyticsStatus = 'failed';
        state.getAnalyticsError = <string>action.error.message;
      });

      builder
      .addCase(getTechAnalyticsAction.pending, state => {
        state.getTechAnalyticsStatus = 'loading';
      })
      .addCase(getTechAnalyticsAction.fulfilled, (state, action) => {
        state.getTechAnalyticsStatus = 'completed';
        state.getTechAnalyticsSuccess = action.payload.message;
        state.techAnalytics = action.payload.result;
      })
      .addCase(getTechAnalyticsAction.rejected, (state, action) => {
        state.getTechAnalyticsStatus = 'failed';
        state.getTechAnalyticsError = <string>action.error.message;
      });

      builder
      .addCase(getSuperAnalyticsAction.pending, state => {
        state.getSuperAnalyticsStatus = 'loading';
      })
      .addCase(getSuperAnalyticsAction.fulfilled, (state, action) => {
        state.getSuperAnalyticsStatus = 'completed';
        state.getSuperAnalyticsSuccess = action.payload.message;
        state.superAnalytics = action.payload.result;
      })
      .addCase(getSuperAnalyticsAction.rejected, (state, action) => {
        state.getSuperAnalyticsStatus = 'failed';
        state.getSuperAnalyticsError = <string>action.error.message;
      });
  },
});

export const {
  clearGetAnalyticsStatus,
  clearGetTechAnalyticsStatus,
  clearGetSuperAnalyticsStatus
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
