import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";
import settings from "../../config/settings";
import { ApiResponseSuccess } from "@app-interfaces";
import { AccountTransactionsResponseDTO } from "@app-models";

const GET_DAILY_ANALYTICS = "dashboard:GET_DAILY_ANALYTICS";
const GET_TECH_ANALYTICS = "dashboard:GET_TECH_ANALYTICS";
const GET_SUPER_ANALYTICS = "dashboard:GET_SUPER_ANALYTICS";
const GET_MAIN_ACCOUNT_TRANSACTIONS_ANALYTICS =
  "dashboard:GET_MAIN_ACCOUNT_TRANSACTIONS_ANALYTICS";
const API_ROOT = settings.api.rest;

export const getAnalyticsAction = createAsyncThunk<any, void>(
  GET_DAILY_ANALYTICS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/dashboard`);
    return response.data;
  })
);

// export const getTechAnalyticsAction = createAsyncThunk<any, void>(
//   GET_TECH_ANALYTICS,
//   asyncThunkErrorWrapper(async (month: any) => {
//     const response = await axiosClient.get(
//       `${API_ROOT}/dashboard-tech?month=${month}`
//     );
//     return response.data;
//   })
// );

export const getTechAnalyticsAction = createAsyncThunk<any, any>(
  GET_TECH_ANALYTICS,
  asyncThunkErrorWrapper(async (args: any) => {

    let response;
    if(args.start_date === undefined || args.end_date === undefined ) {
      
      response = await axiosClient.post(
        `${API_ROOT}/dashboard-tech`, { year: args.year }
      );
    } else {
      response = await axiosClient.post(
        `${API_ROOT}/dashboard-tech?start_date=${args.start_date}&end_date=${args.end_date}`, { year: args.year }
      );
    }

    return response.data;
  })
);

export const getSuperAnalyticsAction = createAsyncThunk<any, any>(
  GET_SUPER_ANALYTICS,
  asyncThunkErrorWrapper(async (args: any) => {
    let url = ``;

    if (args.year === null) {
      url += `dashboard-super?start_date=${args.start_date.toISOString()}&end_date=${args.end_date.toISOString()}`;
    } else {
      url += `dashboard-super?year=${args.year}&month=${args.month}&day=${args.day}`;
    }

    const response = await axiosClient.get(`${API_ROOT}/${url}`);
    return response.data;
  })
);

export const getMainAccountTransactionAnalytics = createAsyncThunk<
  ApiResponseSuccess<AccountTransactionsResponseDTO>,
  void
>(
  GET_MAIN_ACCOUNT_TRANSACTIONS_ANALYTICS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.post(
      `${API_ROOT}/account/main/transactions`
    );
    return response.data;
  })
);
