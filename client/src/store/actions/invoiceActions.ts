import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import axiosClient from '../../config/axiosClient';
import { ApiResponseSuccess } from '@app-interfaces';
import { IInvoice } from '@app-models';
import settings from '../../config/settings';
import { AnyObjectType } from '@app-types';

const GET_INVOICES = 'invoices:GET_INVOICES';
const SAVE_INVOICE = 'invoices:SAVE_INVOICE';
const SEND_INVOICE = 'invoices:SEND_INVOICE';
const GET_SINGLE_INVOICE = 'invoices:GET_SINGLE_INVOICE';
const API_ROOT = settings.api.rest;

export const getInvoicesAction = asyncThunkWrapper<ApiResponseSuccess<IInvoice>, void>(GET_INVOICES, async () => {
  const response = await axiosClient.get(`${API_ROOT}/invoices`);

  return response.data;
});

export const getSingleInvoice = asyncThunkWrapper<ApiResponseSuccess<IInvoice>, number>(
  GET_SINGLE_INVOICE,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/invoice/${id}`);

    return response.data;
  },
);

export const saveInvoiceAction = asyncThunkWrapper<ApiResponseSuccess<IInvoice>, AnyObjectType>(
  SAVE_INVOICE,
  async args => {
    const response = await axiosClient.patch(`${API_ROOT}/invoices/save`, args);

    return response.data;
  },
);

export const sendInvoiceAction = asyncThunkWrapper<ApiResponseSuccess<IInvoice>, AnyObjectType>(
  SEND_INVOICE,
  async args => {
    const response = await axiosClient.patch(`${API_ROOT}/invoices/send`, args);

    return response.data;
  },
);
