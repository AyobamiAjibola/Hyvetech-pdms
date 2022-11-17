import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IEstimate } from '@app-models';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';

const CREATE_ESTIMATE = 'estimate:CREATE_ESTIMATE';
const GET_ESTIMATES = 'estimate:GET_ESTIMATES';
const API_ROOT = settings.api.rest;

export const createEstimateAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, any>(
  CREATE_ESTIMATE,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/estimates`, args);
    return response.data;
  },
);

export const getEstimatesAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, void>(GET_ESTIMATES, async () => {
  const response = await axiosClient.get(`${API_ROOT}/estimates`);
  return response.data;
});
