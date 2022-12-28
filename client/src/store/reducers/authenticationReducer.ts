import { createSlice } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

import { IThunkAPIStatus } from '@app-types';
import { garageSignUpAction, signInAction, signOutAction } from '../actions/authenicationActions';
import { IPermission } from '@app-models';
import { LOCAL_STORAGE } from '../../config/constants';
import { CustomJwtPayload } from '@app-interfaces';
import settings from '../../config/settings';

interface IAuthenticationState {
  signingInStatus: IThunkAPIStatus;
  signingInSuccess: string;
  signingInError?: string;

  garageSignUpStatus: IThunkAPIStatus;
  garageSignUpSuccess: string;
  garageSignUpError: string;

  signOutStatus: IThunkAPIStatus;
  signOutSuccess: string;
  signOutError?: string;

  authToken: string;
  permissions: IPermission[];
}

const initialState: IAuthenticationState = {
  signOutError: '',
  signOutStatus: 'idle',
  signOutSuccess: '',
  authToken: '',
  signingInError: '',
  signingInSuccess: '',
  signingInStatus: 'idle',

  garageSignUpStatus: 'idle',
  garageSignUpSuccess: '',
  garageSignUpError: '',

  permissions: [],
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearLoginStatus(state: IAuthenticationState) {
      state.signingInStatus = 'idle';
      state.signingInSuccess = '';
      state.signingInError = '';
    },
    clearGarageSignUpStatus(state: IAuthenticationState) {
      state.garageSignUpStatus = 'idle';
      state.garageSignUpSuccess = '';
      state.garageSignUpError = '';
    },
    clearLogoutStatus(state: IAuthenticationState) {
      state.signOutStatus = 'idle';
      state.signOutSuccess = '';
      state.signOutError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInAction.pending, state => {
        state.signingInStatus = 'loading';
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.signingInStatus = 'completed';
        state.signingInSuccess = action.payload.message;

        if (action.payload.result) {
          state.authToken = action.payload.result;

          const { permissions } = jwt.decode(state.authToken) as CustomJwtPayload;

          state.permissions = permissions;

          sessionStorage.setItem(LOCAL_STORAGE.permissions, JSON.stringify(permissions));

          sessionStorage.setItem(settings.auth.admin, state.authToken);
        }
      })
      .addCase(signInAction.rejected, (state, action) => {
        state.signingInStatus = 'failed';

        if (action.payload) {
          state.signingInError = action.payload.message;
        } else state.signingInError = action.error.message;
      });

    builder
      .addCase(signOutAction.pending, state => {
        state.signOutStatus = 'loading';
      })
      .addCase(signOutAction.fulfilled, (state, action) => {
        state.signOutStatus = 'completed';
        state.signOutSuccess = action.payload.message;
      })
      .addCase(signOutAction.rejected, (state, action) => {
        state.signOutStatus = 'failed';

        if (action.payload) {
          state.signOutError = action.payload.message;
        } else state.signOutError = action.error.message;
      });

    builder
      .addCase(garageSignUpAction.pending, state => {
        state.garageSignUpStatus = 'loading';
      })
      .addCase(garageSignUpAction.fulfilled, (state, action) => {
        state.garageSignUpStatus = 'completed';
        state.garageSignUpSuccess = action.payload.message;
      })
      .addCase(garageSignUpAction.rejected, (state, action) => {
        state.garageSignUpStatus = 'failed';

        if (action.payload) {
          state.garageSignUpError = action.payload.message;
        } else state.garageSignUpError = action.error.message as string;
      });
  },
});

export const { clearLoginStatus, clearLogoutStatus, clearGarageSignUpStatus } = authenticationSlice.actions;

export default authenticationSlice.reducer;
