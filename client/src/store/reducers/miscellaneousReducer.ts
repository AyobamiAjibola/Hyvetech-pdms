import { IThunkAPIStatus } from '@app-types';
import { IDistrict, IPayStackBank, IState } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import { getPayStackBanksAction, getStatesAndDistrictsAction } from '../actions/miscellaneousActions';

interface IMiscellaneousState {
  getStatesAndDistrictsStatus: IThunkAPIStatus;
  getStatesAndDistrictsSuccess: string;
  getStatesAndDistrictsError?: string;

  getBanksStatus: IThunkAPIStatus;
  getBanksSuccess: string;
  getBanksError?: string;

  states: IState[];
  districts: IDistrict[];
  banks: IPayStackBank[];
}

const initialState: IMiscellaneousState = {
  getStatesAndDistrictsError: '',
  getStatesAndDistrictsStatus: 'idle',
  getStatesAndDistrictsSuccess: '',

  getBanksStatus: 'idle',
  getBanksSuccess: '',
  getBanksError: '',

  banks: [],
  states: [],
  districts: [],
};

const miscellaneousSlice = createSlice({
  name: 'miscellaneous',
  initialState,
  reducers: {
    clearGetStatesAndDistrictsStatus(state: IMiscellaneousState) {
      state.getStatesAndDistrictsStatus = 'idle';
      state.getStatesAndDistrictsSuccess = '';
      state.getStatesAndDistrictsError = '';
    },

    clearGetBanksStatus(state: IMiscellaneousState) {
      state.getBanksStatus = 'idle';
      state.getBanksSuccess = '';
      state.getBanksError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getStatesAndDistrictsAction.pending, state => {
        state.getStatesAndDistrictsStatus = 'loading';
      })
      .addCase(getStatesAndDistrictsAction.fulfilled, (state, action) => {
        state.getStatesAndDistrictsStatus = 'completed';
        state.getStatesAndDistrictsSuccess = action.payload.message;
        state.states = action.payload.results as IState[];
      })
      .addCase(getStatesAndDistrictsAction.rejected, (state, action) => {
        state.getStatesAndDistrictsStatus = 'failed';
        if (action.payload) {
          state.getStatesAndDistrictsError = action.payload.message;
        } else state.getStatesAndDistrictsError = action.error.message;
      });

    builder
      .addCase(getPayStackBanksAction.pending, state => {
        state.getBanksStatus = 'loading';
      })
      .addCase(getPayStackBanksAction.fulfilled, (state, action) => {
        state.getBanksStatus = 'completed';
        state.getBanksSuccess = action.payload.message;
        state.banks = action.payload.results as IPayStackBank[];
      })
      .addCase(getPayStackBanksAction.rejected, (state, action) => {
        state.getBanksStatus = 'failed';
        if (action.payload) {
          state.getBanksError = action.payload.message;
        } else state.getBanksError = action.error.message;
      });
  },
});

export const { clearGetStatesAndDistrictsStatus, clearGetBanksStatus } = miscellaneousSlice.actions;

export default miscellaneousSlice.reducer;
