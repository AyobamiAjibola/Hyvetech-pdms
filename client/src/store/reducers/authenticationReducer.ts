import { createSlice } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";

import { IThunkAPIStatus } from "@app-types";
import { signInAction, signOutAction } from "../actions/authenicationActions";
import { IPermission } from "@app-models";
import { LOCAL_STORAGE } from "../../config/constants";
import { CustomJwtPayload } from "@app-interfaces";

interface IAuthenticationState {
  signingInStatus: IThunkAPIStatus;
  signingInSuccess: string;
  signingInError?: string;

  signOutStatus: IThunkAPIStatus;
  signOutSuccess: string;
  signOutError?: string;

  authToken: string;
  permissions: IPermission[];
}

const initialState: IAuthenticationState = {
  signOutError: "",
  signOutStatus: "idle",
  signOutSuccess: "",
  authToken: "",
  signingInError: "",
  signingInSuccess: "",
  signingInStatus: "idle",
  permissions: [],
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    clearLoginStatus(state: IAuthenticationState) {
      state.signingInStatus = "idle";
      state.signingInSuccess = "";
      state.signingInError = "";
    },

    clearLogoutStatus(state: IAuthenticationState) {
      state.signOutStatus = "idle";
      state.signOutSuccess = "";
      state.signOutError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.signingInStatus = "loading";
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.signingInStatus = "completed";
        state.signingInSuccess = action.payload.message;
        state.authToken = action.payload.result as string;

        const { permissions } = jwt.decode(
          action.payload.result as string
        ) as CustomJwtPayload;

        state.permissions = permissions;

        localStorage.setItem(
          LOCAL_STORAGE.permissions,
          JSON.stringify(permissions)
        );
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.signingInStatus = "failed";

        if (action.payload) {
          state.signingInError = action.payload.message;
        } else state.signingInError = action.error.message;
      });

    builder
      .addCase(signOutAction.pending, (state) => {
        state.signOutStatus = "loading";
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.signOutStatus = "completed";
        state.signOutSuccess = action.payload.message;
      })
      .addCase(signOutAction.rejected, (state, action) => {
        state.signOutStatus = "failed";

        if (action.payload) {
          state.signOutError = action.payload.message;
        } else state.signOutError = action.error.message;
      });
  },
});

export const { clearLoginStatus, clearLogoutStatus } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
