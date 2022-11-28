import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IPayStackBank, IState } from '@app-models';

const GET_STATES_AND_DISTRICTS = 'misc:GET_STATES_AND_DISTRICTS';
const GET_PAYSTACK_BANKS = 'misc:GET_PAYSTACK_BANKS';
const API_ROOT = settings.api.rest;

export const getStatesAndDistrictsAction = asyncThunkWrapper<ApiResponseSuccess<IState>, void>(
  GET_STATES_AND_DISTRICTS,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/states`);
    return response.data;
  },
);

export const getPayStackBanksAction = asyncThunkWrapper<ApiResponseSuccess<IPayStackBank>, void>(
  GET_PAYSTACK_BANKS,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/paystack/banks`);
    return response.data;
  },
);
