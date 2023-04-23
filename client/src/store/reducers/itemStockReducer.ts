import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import {
    createItemAction,
    updateItemAction,
    deleteItemAction,
    getItemsAction,
    addStockAction
} from '../actions/itemStockAction';
import { IItem } from '@app-models';

interface IItemState {
  createItemStatus: IThunkAPIStatus;
  createItemSuccess: string;
  createItemError?: string;

  updateItemStatus: IThunkAPIStatus;
  updateItemSuccess: string;
  updateItemError?: string;

  deleteItemStatus: IThunkAPIStatus;
  deleteItemSuccess: string;
  deleteItemError: string;

  getItemsStatus: IThunkAPIStatus;
  getItemsSuccess: string;
  getItemsError?: string;

  addStockStatus: IThunkAPIStatus;
  addStockSuccess: string;
  addStockError?: string;

  item: IItem | null;
  items: IItem[];
}

const initialState: IItemState = {
  createItemStatus: 'idle',
  createItemSuccess: '',
  createItemError: '',

  updateItemStatus: 'idle',
  updateItemSuccess: '',
  updateItemError: '',

  deleteItemStatus: 'idle',
  deleteItemSuccess: '',
  deleteItemError: '',

  getItemsStatus: 'idle',
  getItemsSuccess: '',
  getItemsError: '',

  addStockStatus: 'idle',
  addStockSuccess: '',
  addStockError: '',

  item: null,
  items: []
}

const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
      clearCreateItemStatus(state: IItemState) {
        state.createItemStatus = 'idle';
        state.createItemSuccess = '';
        state.createItemError = '';
      },

      clearUpdateItemStatus(state: IItemState) {
        state.updateItemStatus = 'idle';
        state.updateItemSuccess = '';
        state.updateItemError = '';
      },

      clearDeleteItemStatus(state: IItemState) {
        state.deleteItemStatus = 'idle';
        state.deleteItemSuccess = '';
        state.deleteItemError = '';
      },

      clearGetItemStatus(state: IItemState) {
        state.getItemsStatus = 'idle';
        state.getItemsSuccess = '';
        state.getItemsError = '';
      },

      clearAddStockStatus(state: IItemState) {
        state.addStockStatus = 'idle';
        state.addStockSuccess = '';
        state.addStockError = '';
      },
    },

    extraReducers: builder => {
        builder
          .addCase(createItemAction.pending, state => {
            state.createItemStatus = 'loading';
          })
          .addCase(createItemAction.fulfilled, (state, action) => {
            state.createItemStatus = 'completed';
            state.createItemSuccess = action.payload.message;

            state.item = action.payload.result as IItem;
          })
          .addCase(createItemAction.rejected, (state, action) => {
            state.createItemStatus = 'failed';

            if(action.payload) {
                state.createItemError = action.payload.message;
            } else state.createItemError = action.error.message;
          });

        builder
          .addCase(updateItemAction.pending, state => {
            state.updateItemStatus = 'loading';
          })
          .addCase(updateItemAction.fulfilled, (state, action) => {
            state.updateItemStatus = 'completed';
            state.updateItemSuccess = action.payload.message;
            state.item = action.payload.result as IItem;
          })
          .addCase(updateItemAction.rejected, (state, action) => {
            state.updateItemStatus = 'failed';

            if(action.payload) {
                state.updateItemError = action.payload.message;
            } else state.updateItemError = action.error.message;
          });

        builder
          .addCase(deleteItemAction.pending, state => {
            state.deleteItemStatus = 'loading';
          })
          .addCase(deleteItemAction.fulfilled, (state, action) => {
            state.deleteItemStatus = 'completed';
            state.deleteItemSuccess = action.payload.message;
          })
          .addCase(deleteItemAction.rejected, (state, action) => {
            state.deleteItemStatus = 'failed';

            if(action.payload) {
                state.deleteItemError = action.payload.message;
            } else state.deleteItemError = action.error.message as string;
          });

        builder
          .addCase(getItemsAction.pending, state => {
            state.getItemsStatus = 'loading';
          })
          .addCase(getItemsAction.fulfilled, (state, action) => {
            state.getItemsStatus = 'completed';
            state.getItemsSuccess = action.payload.message;
            state.items = action.payload.results as IItem[];
          })
          .addCase(getItemsAction.rejected, (state, action) => {
            state.getItemsStatus = 'failed';

            if(action.payload) {
                state.getItemsError = action.payload.message;
            } else state.getItemsError = action.error.message;
          });

        builder
          .addCase(addStockAction.pending, state => {
            state.addStockStatus = 'loading';
          })
          .addCase(addStockAction.fulfilled, (state, action) => {
            state.addStockStatus = 'completed';
            state.addStockSuccess = action.payload.message;
            state.item = action.payload.result as IItem;
          })
          .addCase(addStockAction.rejected, (state, action) => {
            state.addStockStatus = 'failed';

            if(action.payload) {
                state.addStockError = action.payload.message;
            } else state.addStockError = action.error.message;
          });
    }
})

export const {
    clearAddStockStatus,
    clearCreateItemStatus,
    clearDeleteItemStatus,
    clearGetItemStatus,
    clearUpdateItemStatus
} = itemSlice.actions;

export default itemSlice.reducer;