import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IEstimate } from '@app-models';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';

const CREATE_ESTIMATE = 'estimate:CREATE_ESTIMATE';
const UPDATE_ESTIMATE = 'estimate:UPDATE_ESTIMATE';
const DELETE_ESTIMATE = 'estimate:DELETE_ESTIMATE';
const SAVE_ESTIMATE = 'estimate:SAVE_ESTIMATE';
const SEND_DRAFT_ESTIMATE = 'estimate:SEND_DRAFT_ESTIMATE';
const GET_ESTIMATES = 'estimate:GET_ESTIMATES';
const API_ROOT = settings.api.rest;

export const createEstimateAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, any>(
  CREATE_ESTIMATE,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/estimates`, args);
    return response.data;
  },
);

export const deleteEstimateAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(DELETE_ESTIMATE, async id => {
  const response = await axiosClient.delete(`${API_ROOT}/estimates/${id}`);
  return response.data;
});

export const saveEstimateAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, any>(SAVE_ESTIMATE, async args => {
  const response = await axiosClient.put(`${API_ROOT}/estimates`, args);
  return response.data;
});

export const updateEstimateAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, any>(
  UPDATE_ESTIMATE,
  async args => {
    const response = await axiosClient.patch(`${API_ROOT}/estimate/${args.id}`, args);
    return response.data;
  },
);

export const sendDraftEstimateAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, any>(
  SEND_DRAFT_ESTIMATE,
  async args => {
    const response = await axiosClient.put(`${API_ROOT}/estimate/${args.id}`, args);
    return response.data;
  },
);

export const getEstimatesAction = asyncThunkWrapper<ApiResponseSuccess<IEstimate>, void>(GET_ESTIMATES, async () => {
  const response = await axiosClient.get(`${API_ROOT}/estimates`);
  return response.data;
});
