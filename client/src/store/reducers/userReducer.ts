import { IThunkAPIStatus } from "@app-types";
import { IUser } from "@app-models";
import { createSlice } from "@reduxjs/toolkit";
import { getUserAction, getUsersAction } from "../actions/userActions";

interface IUserState {
  getUserStatus: IThunkAPIStatus;
  getUserSuccess: string;
  getUserError?: string;

  getUsersStatus: IThunkAPIStatus;
  getUsersSuccess: string;
  getUsersError?: string;

  users: IUser[];
  user: IUser | null;
}

const initialState: IUserState = {
  getUserError: "",
  getUserStatus: "idle",
  getUserSuccess: "",
  getUsersError: "",
  getUsersStatus: "idle",
  getUsersSuccess: "",
  user: null,
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearGetUsersStatus(state: IUserState) {
      state.getUsersStatus = "idle";
      state.getUsersSuccess = "";
      state.getUsersError = "";
    },
    clearGetUserStatus(state: IUserState) {
      state.getUserStatus = "idle";
      state.getUserSuccess = "";
      state.getUserError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAction.pending, (state) => {
        state.getUsersStatus = "loading";
      })
      .addCase(getUsersAction.fulfilled, (state, action) => {
        state.getUsersStatus = "completed";
        state.getUsersSuccess = action.payload.message;
        state.users = action.payload.results as IUser[];
      })
      .addCase(getUsersAction.rejected, (state, action) => {
        state.getUsersStatus = "failed";

        if (action.payload) {
          state.getUsersError = action.payload.message;
        } else state.getUsersError = action.error.message;
      });

    builder
      .addCase(getUserAction.pending, (state) => {
        state.getUserStatus = "loading";
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.getUserStatus = "completed";
        state.getUserSuccess = action.payload.message;
        state.user = action.payload.result as IUser;
      })
      .addCase(getUserAction.rejected, (state, action) => {
        state.getUserStatus = "failed";

        if (action.payload) {
          state.getUserError = action.payload.message;
        } else state.getUserError = action.error.message;
      });
  },
});

export const { clearGetUsersStatus, clearGetUserStatus } = userSlice.actions;
export default userSlice.reducer;
