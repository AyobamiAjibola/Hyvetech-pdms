import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { ICustomer } from '@app-models';

const GET_CUSTOMERS = 'customer:GET_CUSTOMERS';
const GET_NEW_CUSTOMERS = 'customer:GET_NEW_CUSTOMERS';
const GET_CUSTOMER = 'customer:GET_CUSTOMER';
const UPDATE_CUSTOMER = 'customer:UPDATE_CUSTOMER';
const GET_CUSTOMER_VEHICLES = 'customer:GET_CUSTOMER_VEHICLES';
const GET_CUSTOMER_APPOINTMENTS = 'customer:GET_CUSTOMER_APPOINTMENTS';
const GET_CUSTOMER_TRANSACTIONS = 'customer:GET_CUSTOMER_TRANSACTIONS';
const API_ROOT = settings.api.rest;

export const getCustomersAction = asyncThunkWrapper<any, void>(GET_CUSTOMERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/customers`);
  return response.data;
});

export const getNewCustomersAction = asyncThunkWrapper<any, void>(GET_NEW_CUSTOMERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/new-customers`);
  return response.data;
});

export const getCustomerAction = asyncThunkWrapper<ApiResponseSuccess<ICustomer>, number>(GET_CUSTOMER, async id => {
  const response = await axiosClient.get(`${API_ROOT}/customer/${id}`);
  return response.data;
});

export const updateCustomerAction = asyncThunkWrapper<ApiResponseSuccess<ICustomer>, any>(UPDATE_CUSTOMER, async payload => {
  const response = await axiosClient.post(`${API_ROOT}/update-customer`, payload);
  return response.data;
});

export const getCustomerVehiclesAction = asyncThunkWrapper<any, number>(GET_CUSTOMER_VEHICLES, async (id: number) => {
  const response = await axiosClient.get(`${API_ROOT}/customers/${id}/vehicles`);
  return response.data;
});

export const getCustomerAppointmentsAction = asyncThunkWrapper<any, number>(
  GET_CUSTOMER_APPOINTMENTS,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/customers/${id}/appointments`);
    return response.data;
  },
);

export const getCustomerTransactionsAction = asyncThunkWrapper<any, number>(
  GET_CUSTOMER_TRANSACTIONS,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/customers/${id}/transactions`);
    return response.data;
  },
);
