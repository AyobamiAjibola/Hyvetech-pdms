import { createSlice } from '@reduxjs/toolkit';
import { IThunkAPIStatus } from '@app-types';
import { getAnalyticsAction } from '../actions/dashboardActions';
import { IDashboardData } from '@app-interfaces';

interface IDashboardState {
  getAnalyticsStatus: IThunkAPIStatus;
  getAnalyticsSuccess: string;
  getAnalyticsError: string;
  analytics: IDashboardData | null;
  stackedMonthlyData: { name: string; data: number[] }[];
}

const initialState: IDashboardState = {
  getAnalyticsError: '',
  getAnalyticsSuccess: '',
  getAnalyticsStatus: 'idle',
  analytics: null,
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
  },
});

export const { clearGetAnalyticsStatus } = dashboardSlice.actions;

export default dashboardSlice.reducer;
