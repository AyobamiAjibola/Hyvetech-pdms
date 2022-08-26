import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import { signInAction } from "../actions/authenicationActions";
import { IPermission } from "@app-models";

interface IAuthenticationState {
  signingInStatus: IThunkAPIStatus;
  signingInSuccess: string;
  signingInError: string;
  authToken: string;
  permissions: IPermission[];
}

const initialState: IAuthenticationState = {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.signingInStatus = "loading";
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.signingInStatus = "completed";
        state.signingInSuccess = action.payload.message;
        state.authToken = action.payload.result;
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.signingInStatus = "failed";
        state.signingInError = <string>action.error.message;
      });
  },
});

export const { clearLoginStatus } = authenticationSlice.actions;

export default authenticationSlice.reducer;
