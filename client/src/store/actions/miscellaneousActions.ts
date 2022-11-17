import settings from '../../config/settings';
import { createAsyncThunk } from '@reduxjs/toolkit';
import asyncThunkErrorWrapper from '../../helpers/asyncThunkErrorWrapper';
import axiosClient from '../../config/axiosClient';

const GET_STATES_AND_DISTRICTS = 'states:GET_STATES_AND_DISTRICTS';
const API_ROOT = settings.api.rest;

export const getStatesAndDistrictsAction = createAsyncThunk<any, void, { rejectValue: { message: string } }>(
  GET_STATES_AND_DISTRICTS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/states`);
    return response.data;
  }),
);
