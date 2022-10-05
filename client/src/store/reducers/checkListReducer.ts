import { IThunkAPIStatus } from "@app-types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createCheckListAction,
  deleteCheckListAction,
  getCheckListAction,
  getCheckListsAction,
  updateCheckListAction,
} from "../actions/checkListActions";
import { ICheckList } from "@app-models";

interface ICheckListState {
  createCheckListStatus: IThunkAPIStatus;
  createCheckListSuccess: string;
  createCheckListError?: string;

  updateCheckListStatus: IThunkAPIStatus;
  updateCheckListSuccess: string;
  updateCheckListError?: string;

  deleteCheckListStatus: IThunkAPIStatus;
  deleteCheckListSuccess: string;
  deleteCheckListError?: string;

  getCheckListsStatus: IThunkAPIStatus;
  getCheckListsSuccess: string;
  getCheckListsError?: string;

  getCheckListStatus: IThunkAPIStatus;
  getCheckListSuccess: string;
  getCheckListError?: string;

  checkLists: ICheckList[];
  checkList: ICheckList | null;
}

const initialState: ICheckListState = {
  createCheckListStatus: "idle",
  createCheckListSuccess: "",
  createCheckListError: "",

  updateCheckListStatus: "idle",
  updateCheckListSuccess: "",
  updateCheckListError: "",

  deleteCheckListStatus: "idle",
  deleteCheckListSuccess: "",
  deleteCheckListError: "",

  getCheckListsStatus: "idle",
  getCheckListsSuccess: "",
  getCheckListsError: "",

  getCheckListStatus: "idle",
  getCheckListSuccess: "",
  getCheckListError: "",

  checkLists: [],
  checkList: null,
};

const checkListSlice = createSlice({
  name: "check_list",
  initialState,
  reducers: {
    clearCreateCheckListStatus(state: ICheckListState) {
      state.createCheckListStatus = "idle";
      state.createCheckListSuccess = "";
      state.createCheckListError = "";
    },
    clearUpdateCheckListStatus(state: ICheckListState) {
      state.updateCheckListStatus = "idle";
      state.updateCheckListSuccess = "";
      state.updateCheckListError = "";
    },
    clearDeleteCheckListStatus(state: ICheckListState) {
      state.deleteCheckListStatus = "idle";
      state.deleteCheckListSuccess = "";
      state.deleteCheckListError = "";
    },
    clearGetCheckListsStatus(state: ICheckListState) {
      state.getCheckListsStatus = "idle";
      state.getCheckListsSuccess = "";
      state.getCheckListsError = "";
    },
    clearGetCheckListStatus(state: ICheckListState) {
      state.getCheckListStatus = "idle";
      state.getCheckListSuccess = "";
      state.getCheckListError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckListAction.pending, (state) => {
        state.createCheckListStatus = "loading";
      })
      .addCase(createCheckListAction.fulfilled, (state, action) => {
        state.createCheckListStatus = "completed";
        state.createCheckListSuccess = action.payload.message;
      })
      .addCase(createCheckListAction.rejected, (state, action) => {
        state.createCheckListStatus = "failed";

        if (action.payload) {
          state.createCheckListError = action.payload.message;
        } else state.createCheckListError = action.error.message;
      });

    builder
      .addCase(updateCheckListAction.pending, (state) => {
        state.updateCheckListStatus = "loading";
      })
      .addCase(updateCheckListAction.fulfilled, (state, action) => {
        state.updateCheckListStatus = "completed";
        state.updateCheckListSuccess = action.payload.message;
      })
      .addCase(updateCheckListAction.rejected, (state, action) => {
        state.updateCheckListStatus = "failed";

        if (action.payload) {
          state.updateCheckListError = action.payload.message;
        } else state.updateCheckListError = action.error.message;
      });

    builder
      .addCase(deleteCheckListAction.pending, (state) => {
        state.deleteCheckListStatus = "loading";
      })
      .addCase(deleteCheckListAction.fulfilled, (state, action) => {
        state.deleteCheckListStatus = "completed";
        state.deleteCheckListSuccess = action.payload.message;
      })
      .addCase(deleteCheckListAction.rejected, (state, action) => {
        state.deleteCheckListStatus = "failed";

        if (action.payload) {
          state.deleteCheckListError = action.payload.message;
        } else state.deleteCheckListError = action.error.message;
      });

    builder
      .addCase(getCheckListsAction.pending, (state) => {
        state.getCheckListsStatus = "loading";
      })
      .addCase(getCheckListsAction.fulfilled, (state, action) => {
        state.getCheckListsStatus = "completed";
        state.getCheckListsSuccess = action.payload.message;
      })
      .addCase(getCheckListsAction.rejected, (state, action) => {
        state.getCheckListsStatus = "failed";

        if (action.payload) {
          state.getCheckListsError = action.payload.message;
        } else state.getCheckListsError = action.error.message;
      });

    builder
      .addCase(getCheckListAction.pending, (state) => {
        state.getCheckListStatus = "loading";
      })
      .addCase(getCheckListAction.fulfilled, (state, action) => {
        state.getCheckListStatus = "completed";
        state.getCheckListSuccess = action.payload.message;
      })
      .addCase(getCheckListAction.rejected, (state, action) => {
        state.getCheckListStatus = "failed";

        if (action.payload) {
          state.getCheckListError = action.payload.message;
        } else state.getCheckListError = action.error.message;
      });
  },
});

export const {
  clearCreateCheckListStatus,
  clearDeleteCheckListStatus,
  clearUpdateCheckListStatus,
} = checkListSlice.actions;
export default checkListSlice.reducer;
