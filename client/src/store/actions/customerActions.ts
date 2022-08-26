import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";
import settings from "../../config/settings";

const GET_CUSTOMERS = "customer:GET_CUSTOMERS";
const GET_CUSTOMER_VEHICLES = "customer:GET_CUSTOMER_VEHICLES";
const GET_CUSTOMER_APPOINTMENTS = "customer:GET_CUSTOMER_APPOINTMENTS";
const GET_CUSTOMER_TRANSACTIONS = "customer:GET_CUSTOMER_TRANSACTIONS";
const API_ROOT = settings.api.rest;

export const getCustomersAction = createAsyncThunk(
  GET_CUSTOMERS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/customers`);
    return response.data;
  })
);

export const getCustomerVehiclesAction = createAsyncThunk(
  GET_CUSTOMER_VEHICLES,
  asyncThunkErrorWrapper(async (id: number) => {
    const response = await axiosClient.get(
      `${API_ROOT}/customers/${id}/vehicles`
    );
    return response.data;
  })
);

export const getCustomerAppointmentsAction = createAsyncThunk(
  GET_CUSTOMER_APPOINTMENTS,
  asyncThunkErrorWrapper(async (id: number) => {
    const response = await axiosClient.get(
      `${API_ROOT}/customers/${id}/appointments`
    );
    return response.data;
  })
);

export const getCustomerTransactionsAction = createAsyncThunk(
  GET_CUSTOMER_TRANSACTIONS,
  asyncThunkErrorWrapper(async (id: number) => {
    const response = await axiosClient.get(
      `${API_ROOT}/customers/${id}/transactions`
    );
    return response.data;
  })
);
