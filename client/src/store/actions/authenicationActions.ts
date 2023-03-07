import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IGarageSignupModel } from '../../components/forms/models/garageSignUpModel';

const SIGN_IN = 'authentication:SIGN_IN';
const GARAGE_SIGN_UP = 'authentication:GARAGE_SIGN_UP';
const SIGN_OUT = 'authentication:SIGN_OUT';
const API_ROOT = settings.api.rest;

export const signInAction = asyncThunkWrapper<ApiResponseSuccess<string>, any>(SIGN_IN, async (args: any) => {
  console.log('SING> ', args);
  const response = await axiosClient.post(`${API_ROOT}/sign-in`, args);

  return response.data;
});

export const garageSignUpAction = asyncThunkWrapper<ApiResponseSuccess<string>, IGarageSignupModel>(
  GARAGE_SIGN_UP,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/garage-sign-up`, args);

    return response.data;
  },
);

export const signOutAction = asyncThunkWrapper<ApiResponseSuccess<null>, void>(SIGN_OUT, async () => {
  const response = await axiosClient.get(`${API_ROOT}/sign-out`);

  return response.data;
});
