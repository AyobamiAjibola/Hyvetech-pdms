import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axiosClient';
import asyncThunkErrorWrapper from '../../helpers/asyncThunkErrorWrapper';
import settings from '../../config/settings';

const GET_DAILY_ANALYTICS = 'dashboard:GET_DAILY_ANALYTICS';
const API_ROOT = settings.api.rest;

export const getAnalyticsAction = createAsyncThunk<any, void>(
  GET_DAILY_ANALYTICS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/dashboard`);
    return response.data;
  }),
);
