import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import {
  createEstimateAction,
  deleteEstimateAction,
  getEstimatesAction,
  saveEstimateAction,
  sendDraftEstimateAction,
  updateEstimateAction,
} from '../actions/estimateActions';
import { IEstimate } from '@app-models';

interface IEstimateState {
  createEstimateStatus: IThunkAPIStatus;
  createEstimateSuccess: string;
  createEstimateError?: string;

  saveEstimateStatus: IThunkAPIStatus;
  saveEstimateSuccess: string;
  saveEstimateError?: string;

  updateEstimateStatus: IThunkAPIStatus;
  updateEstimateSuccess: string;
  updateEstimateError?: string;

  deleteEstimateStatus: IThunkAPIStatus;
  deleteEstimateSuccess: string;
  deleteEstimateError: string;

  sendDraftEstimateStatus: IThunkAPIStatus;
  sendDraftEstimateSuccess: string;
  sendDraftEstimateError?: string;

  getEstimatesStatus: IThunkAPIStatus;
  getEstimatesSuccess: string;
  getEstimatesError?: string;

  estimate: IEstimate | null;
  estimates: IEstimate[];
}

const initialState: IEstimateState = {
  createEstimateError: '',
  createEstimateStatus: 'idle',
  createEstimateSuccess: '',

  saveEstimateError: '',
  saveEstimateStatus: 'idle',
  saveEstimateSuccess: '',

  updateEstimateError: '',
  updateEstimateStatus: 'idle',
  updateEstimateSuccess: '',

  deleteEstimateError: '',
  deleteEstimateStatus: 'idle',
  deleteEstimateSuccess: '',

  sendDraftEstimateError: '',
  sendDraftEstimateStatus: 'idle',
  sendDraftEstimateSuccess: '',

  getEstimatesError: '',
  getEstimatesStatus: 'idle',
  getEstimatesSuccess: '',

  estimates: [],
  estimate: null,
};

const estimateSlice = createSlice({
  name: 'estimate',
  initialState,
  reducers: {
    clearCreateEstimateStatus(state: IEstimateState) {
      state.createEstimateStatus = 'idle';
      state.createEstimateSuccess = '';
      state.createEstimateError = '';
    },

    clearSaveEstimateStatus(state: IEstimateState) {
      state.saveEstimateStatus = 'idle';
      state.saveEstimateSuccess = '';
      state.saveEstimateError = '';
    },

    clearUpdateEstimateStatus(state: IEstimateState) {
      state.updateEstimateStatus = 'idle';
      state.updateEstimateSuccess = '';
      state.updateEstimateError = '';
    },

    clearDeleteEstimateStatus(state: IEstimateState) {
      state.deleteEstimateStatus = 'idle';
      state.deleteEstimateSuccess = '';
      state.deleteEstimateError = '';
    },

    clearSendDraftEstimateStatus(state: IEstimateState) {
      state.sendDraftEstimateStatus = 'idle';
      state.sendDraftEstimateSuccess = '';
      state.sendDraftEstimateError = '';
    },
    clearGetEstimateStatus(state: IEstimateState) {
      state.getEstimatesStatus = 'idle';
      state.getEstimatesSuccess = '';
      state.getEstimatesError = '';
    },
  },

  extraReducers: builder => {
    builder
      .addCase(createEstimateAction.pending, state => {
        state.createEstimateStatus = 'loading';
      })
      .addCase(createEstimateAction.fulfilled, (state, action) => {
        state.createEstimateStatus = 'completed';
        state.createEstimateSuccess = action.payload.message;

        state.estimate = action.payload.result as IEstimate;
      })
      .addCase(createEstimateAction.rejected, (state, action) => {
        state.createEstimateStatus = 'failed';

        if (action.payload) {
          state.createEstimateError = action.payload.message;
        } else state.createEstimateError = action.error.message;
      });

    builder
      .addCase(saveEstimateAction.pending, state => {
        state.saveEstimateStatus = 'loading';
      })
      .addCase(saveEstimateAction.fulfilled, (state, action) => {
        state.saveEstimateStatus = 'completed';
        state.saveEstimateSuccess = action.payload.message;
        state.estimate = action.payload.result as IEstimate;
      })
      .addCase(saveEstimateAction.rejected, (state, action) => {
        state.saveEstimateStatus = 'failed';

        if (action.payload) {
          state.saveEstimateError = action.payload.message;
        } else state.saveEstimateError = action.error.message;
      });

    builder
      .addCase(updateEstimateAction.pending, state => {
        state.updateEstimateStatus = 'loading';
      })
      .addCase(updateEstimateAction.fulfilled, (state, action) => {
        state.updateEstimateStatus = 'completed';
        state.updateEstimateSuccess = action.payload.message;
        state.estimate = action.payload.result as IEstimate;
      })
      .addCase(updateEstimateAction.rejected, (state, action) => {
        state.updateEstimateStatus = 'failed';

        if (action.payload) {
          state.updateEstimateError = action.payload.message;
        } else state.updateEstimateError = action.error.message;
      });

    builder
      .addCase(deleteEstimateAction.pending, state => {
        state.updateEstimateStatus = 'loading';
      })
      .addCase(deleteEstimateAction.fulfilled, (state, action) => {
        state.deleteEstimateStatus = 'completed';
        state.deleteEstimateSuccess = action.payload.message;
      })
      .addCase(deleteEstimateAction.rejected, (state, action) => {
        state.deleteEstimateStatus = 'failed';

        if (action.payload) {
          state.deleteEstimateError = action.payload.message;
        } else state.deleteEstimateError = action.error.message as string;
      });

    builder
      .addCase(sendDraftEstimateAction.pending, state => {
        state.sendDraftEstimateStatus = 'loading';
      })
      .addCase(sendDraftEstimateAction.fulfilled, (state, action) => {
        state.sendDraftEstimateStatus = 'completed';
        state.sendDraftEstimateSuccess = action.payload.message;
        state.estimate = action.payload.result as IEstimate;
      })
      .addCase(sendDraftEstimateAction.rejected, (state, action) => {
        state.sendDraftEstimateStatus = 'failed';

        if (action.payload) {
          state.sendDraftEstimateError = action.payload.message;
        } else state.sendDraftEstimateError = action.error.message;
      });

    builder
      .addCase(getEstimatesAction.pending, state => {
        state.getEstimatesStatus = 'loading';
      })
      .addCase(getEstimatesAction.fulfilled, (state, action) => {
        state.getEstimatesStatus = 'completed';
        state.getEstimatesSuccess = action.payload.message;
        state.estimates = action.payload.results as IEstimate[];
      })
      .addCase(getEstimatesAction.rejected, (state, action) => {
        state.getEstimatesStatus = 'failed';

        if (action.payload) {
          state.getEstimatesError = action.payload.message;
        } else state.getEstimatesError = action.error.message;
      });
  },
});

export const {
  clearCreateEstimateStatus,
  clearGetEstimateStatus,
  clearSaveEstimateStatus,
  clearSendDraftEstimateStatus,
  clearUpdateEstimateStatus,
  clearDeleteEstimateStatus,
} = estimateSlice.actions;

export default estimateSlice.reducer;
