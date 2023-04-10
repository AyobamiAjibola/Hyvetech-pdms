import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axiosClient';
import asyncThunkErrorWrapper from '../../helpers/asyncThunkErrorWrapper';
import settings from '../../config/settings';

const GET_DAILY_ANALYTICS = 'dashboard:GET_DAILY_ANALYTICS';
const GET_TECH_ANALYTICS = 'dashboard:GET_TECH_ANALYTICS';
const GET_SUPER_ANALYTICS = 'dashboard:GET_SUPER_ANALYTICS';
const API_ROOT = settings.api.rest;

export const getAnalyticsAction = createAsyncThunk<any, void>(
  GET_DAILY_ANALYTICS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/dashboard`);
    return response.data;
  }),
);

export const getTechAnalyticsAction = createAsyncThunk<any, void>(
  GET_TECH_ANALYTICS,
  asyncThunkErrorWrapper(async (month: any) => {
    const response = await axiosClient.get(`${API_ROOT}/dashboard-tech?month=${month}`);
    return response.data;
  }),
);


export const getSuperAnalyticsAction = createAsyncThunk<any, void>(
  GET_SUPER_ANALYTICS,
  asyncThunkErrorWrapper(async (args: any) => {
    let url = ``;

    if(args.start_date === null && args.end_date === null) {
      url += `dashboard-super?year=${args.year}&month=${args.month}&day=${args.day}`
    } else {
      if(args.start_date !== null && args.end_date !== null) {
        url += `dashboard-super?start_date=${args.start_date.toISOString()}&end_date=${ args.end_date.toISOString()}` }
    }
    console.log(url)
    const response = await axiosClient.get(`${API_ROOT}/${url}`);
    return response.data;
  }),
);

