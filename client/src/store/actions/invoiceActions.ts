import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import axiosClient from '../../config/axiosClient';
import { ApiResponseSuccess } from '@app-interfaces';
import { IInvoice } from '@app-models';
import settings from '../../config/settings';

const GET_INVOICES = 'invoices:GET_INVOICES';
const API_ROOT = settings.api.rest;

export const getInvoicesAction = asyncThunkWrapper<ApiResponseSuccess<IInvoice>, void>(GET_INVOICES, async () => {
  const response = await axiosClient.get(`${API_ROOT}/invoices`);

  return response.data;
});
