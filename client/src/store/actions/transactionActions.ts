import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess, IInitTransaction } from '@app-interfaces';
import axiosClient from '../../config/axiosClient';
import { AnyObjectType } from '@app-types';

const INIT_REFUND_CUSTOMER = 'txn:INIT_REFUND_CUSTOMER';
const VERIFY_REFUND_CUSTOMER = 'txn:VERIFY_REFUND_CUSTOMER';
const API_ROOT = settings.api.rest;

export const initRefundCustomerAction = asyncThunkWrapper<ApiResponseSuccess<IInitTransaction>, AnyObjectType>(
  INIT_REFUND_CUSTOMER,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/transactions/init-refund-customer`, args);

    return response.data;
  },
);

type VerifyRefundType = {
  reference: string;
  invoiceId: number;
};
export const verifyRefundCustomerAction = asyncThunkWrapper<ApiResponseSuccess<IInitTransaction>, VerifyRefundType>(
  VERIFY_REFUND_CUSTOMER,
  async args => {
    const { invoiceId, reference } = args;

    const response = await axiosClient.get(
      `${API_ROOT}/transactions/verify-refund-customer/?reference=${reference}&invoiceId=${invoiceId}`,
    );

    return response.data;
  },
);