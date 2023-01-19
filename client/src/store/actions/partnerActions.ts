import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import { ICreatePartnerModel, IGarageSettings, IKycValues } from '../../components/forms/models/partnerModel';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IPartner, IPaymentPlan, IPlan } from '@app-models';

const CREATE_PARTNER = 'partner:CREATE_PARTNER';
const DELETE_PARTNER = 'partner:DELETE_PARTNER';
const TOGGLE_PARTNER = 'partner:TOGGLE_PARTNER';
const CREATE_PARTNER_KYC = 'partner:CREATE_PARTNER_KYC';
const CREATE_PARTNER_SETTINGS = 'partner:CREATE_PARTNER_SETTINGS';
const GET_PARTNERS = 'partner:GET_PARTNERS';
const GET_DRIVERS_FILTER_DATA = 'partner:GET_DRIVERS_FILTER_DATA';
const GET_OWNERS_FILTER_DATA = 'partner:GET_OWNERS_FILTER_DATA';
const GET_PARTNER = 'partner:GET_PARTNER';
const CREATE_PLAN = 'partner:CREATE_PLAN';
const DELETE_PLAN = 'partner:DELETE_PLAN';
const CREATE_PAYMENT_PLAN = 'partner:CREATE_PAYMENT_PLAN';
const DELETE_PAYMENT_PLAN = 'partner:DELETE_PAYMENT_PLAN';
const GET_PLANS = 'partner:GET_PLANS';
const GET_PAYMENT_PLANS = 'partner:GET_PAYMENT_PLANS';
const API_ROOT = settings.api.rest;

export const createPartnerAction = asyncThunkWrapper<any, ICreatePartnerModel>(
  CREATE_PARTNER,
  async (args: ICreatePartnerModel) => {
    const formData = new FormData();

    if (args.logo) formData.append('logo', args.logo);

    formData.append('name', args.name);
    formData.append('email', args.email);
    formData.append('phone', args.phone);
    formData.append('state', args.state);
    formData.append('category', args.category);

    const response = await axiosClient.post(`${API_ROOT}/partners`, formData);
    return response.data;
  },
);

export const deletePartnerAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(
  DELETE_PARTNER,
  async partnerId => {
    const response = await axiosClient.delete(`${API_ROOT}/partners/${partnerId}`);
    return response.data;
  },
);

export const togglePartnerAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(
  TOGGLE_PARTNER,
  async partnerId => {
    const response = await axiosClient.post(`${API_ROOT}/partners-toggle/${partnerId}`);
    return response.data;
  },
);

interface ICreateKycArgs {
  data: IKycValues;
  partnerId: number;
}

export const createPartnerKycAction = asyncThunkWrapper<ApiResponseSuccess<IPartner>, ICreateKycArgs>(
  CREATE_PARTNER_KYC,
  async args => {
    const response = await axiosClient.patch(`${API_ROOT}/partners/${args.partnerId}/kyc`, args.data);
    return response.data;
  },
);

interface ICreateSettingsArgs {
  data: IGarageSettings;
  partnerId: number;
}

export const createPartnerSettingsAction = asyncThunkWrapper<ApiResponseSuccess<IPartner>, ICreateSettingsArgs>(
  CREATE_PARTNER_SETTINGS,
  async args => {
    const formData = new FormData();

    formData.set('logo', args.data.logo);
    formData.set('phone', args.data.phone);
    formData.set('workingHours', JSON.stringify(args.data.workingHours));
    formData.set('brands', JSON.stringify(args.data.brands));
    formData.set('bankName', args.data.bankName);
    formData.set('googleMap', args.data.googleMap);
    formData.set('totalStaff', args.data.totalStaff);
    formData.set('totalTechnicians', args.data.totalTechnicians);
    formData.set('accountNumber', args.data.accountNumber);
    formData.set('accountName', args.data.accountName);

    axiosClient.defaults.headers.patch['Content-Type'] = 'multipart/form-data';

    const response = await axiosClient.patch(`${API_ROOT}/partners/${args.partnerId}/settings`, formData);

    return response.data;
  },
);

export const getPartnersAction = asyncThunkWrapper<any, void>(GET_PARTNERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/partners`);
  return response.data;
});

export const getPartnerAction = asyncThunkWrapper<any, number>(GET_PARTNER, async (id: number) => {
  const response = await axiosClient.get(`${API_ROOT}/partners/${id}`);
  return response.data;
});

interface AddPlanArgs {
  plan: any;
  partnerId: string;
}

export const addPlanAction = asyncThunkWrapper<any, AddPlanArgs>(CREATE_PLAN, async (args: AddPlanArgs) => {
  const response = await axiosClient.post(`${API_ROOT}/partners/${args.partnerId}/plans`, args.plan);
  return response.data;
});

interface AddPaymentPlanArgs {
  paymentPlan: any;
  partnerId: string;
}

export const addPaymentPlanAction = asyncThunkWrapper<any, AddPaymentPlanArgs>(
  CREATE_PAYMENT_PLAN,
  async (args: AddPaymentPlanArgs) => {
    const response = await axiosClient.post(`${API_ROOT}/partners/${args.partnerId}/payment-plans`, args.paymentPlan);
    return response.data;
  },
);

export const getPlansAction = asyncThunkWrapper<any, number>(GET_PLANS, async (partnerId: number) => {
  const response = await axiosClient.get(`${API_ROOT}/partners/${partnerId}/plans`);
  return response.data;
});

export const getPaymentPlansAction = asyncThunkWrapper<any, number>(GET_PAYMENT_PLANS, async (partnerId: number) => {
  const response = await axiosClient.get(`${API_ROOT}/partners/${partnerId}/payment-plans`);
  return response.data;
});

export const getDriversFilterDataAction = asyncThunkWrapper<any, number>(
  GET_DRIVERS_FILTER_DATA,
  async (partnerId: number) => {
    const response = await axiosClient.get(`${API_ROOT}/partners/${partnerId}/drivers-filter-data`);
    return response.data;
  },
);

export const getOwnersFilterDataAction = asyncThunkWrapper<any, number>(
  GET_OWNERS_FILTER_DATA,
  async (partnerId: number) => {
    const response = await axiosClient.get(`${API_ROOT}/partners/${partnerId}/owners-filter-data`);
    return response.data;
  },
);

export const deletePlanAction = asyncThunkWrapper<ApiResponseSuccess<IPlan>, number>(
  DELETE_PLAN,
  async (planId: number) => {
    const response = await axiosClient.delete(`${API_ROOT}/partners?planId=${planId}`);
    return response.data;
  },
);

export const deletePaymentPlanAction = asyncThunkWrapper<ApiResponseSuccess<IPaymentPlan>, number>(
  DELETE_PAYMENT_PLAN,
  async paymentPlanId => {
    const response = await axiosClient.delete(`${API_ROOT}/partners?paymentPlanId=${paymentPlanId}`);
    return response.data;
  },
);
