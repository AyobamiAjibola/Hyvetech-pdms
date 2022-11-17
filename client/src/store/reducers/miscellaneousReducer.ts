import { IThunkAPIStatus } from '@app-types';
import { IDistrict, IState } from '@app-models';
import { createSlice } from '@reduxjs/toolkit';
import { getStatesAndDistrictsAction } from '../actions/miscellaneousActions';

interface IMiscellaneousState {
  getStatesAndDistrictsStatus: IThunkAPIStatus;
  getStatesAndDistrictsSuccess: string;
  getStatesAndDistrictsError?: string;

  states: IState[];
  districts: IDistrict[];
}

const initialState: IMiscellaneousState = {
  districts: [],
  getStatesAndDistrictsError: '',
  getStatesAndDistrictsStatus: 'idle',
  getStatesAndDistrictsSuccess: '',
  states: [],
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
  },
  extraReducers: builder => {
    builder.addCase(getStatesAndDistrictsAction.pending, state => {
      state.getStatesAndDistrictsStatus = 'loading';
    });
    builder.addCase(getStatesAndDistrictsAction.fulfilled, (state, action) => {
      state.getStatesAndDistrictsStatus = 'completed';
      state.getStatesAndDistrictsSuccess = action.payload.message;
      state.states = action.payload.results as IState[];
    });
    builder.addCase(getStatesAndDistrictsAction.rejected, (state, action) => {
      state.getStatesAndDistrictsStatus = 'failed';
      if (action.payload) {
        state.getStatesAndDistrictsError = action.payload.message;
      } else state.getStatesAndDistrictsError = action.error.message;
    });
  },
});

export const { clearGetStatesAndDistrictsStatus } = miscellaneousSlice.actions;

export default miscellaneousSlice.reducer;
