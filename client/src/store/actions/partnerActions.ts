import settings from "../../config/settings";
import { createAsyncThunk } from "@reduxjs/toolkit";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";
import axiosClient from "../../config/axiosClient";
import { ICreatePartnerModel } from "../../components/forms/models/partnerModel";

const CREATE_PARTNER = "partner:CREATE_PARTNER";
const GET_PARTNERS = "partner:GET_PARTNERS";
const GET_PARTNER = "partner:GET_PARTNER";
const CREATE_PLAN = "partner:CREATE_PLAN";
const CREATE_PAYMENT_PLAN = "partner:CREATE_PAYMENT_PLAN";
const GET_PLANS = "partner:GET_PLANS";
const GET_PAYMENT_PLANS = "partner:GET_PAYMENT_PLANS";
const API_ROOT = settings.api.rest;

export const createPartnerAction = createAsyncThunk<
  any,
  ICreatePartnerModel,
  { rejectValue: { message: string } }
>(
  CREATE_PARTNER,
  asyncThunkErrorWrapper(async (args: ICreatePartnerModel) => {
    const response = await axiosClient.post(`${API_ROOT}/partners`, args);
    return response.data;
  })
);

export const getPartnersAction = createAsyncThunk<
  any,
  void,
  { rejectValue: { message: string } }
>(
  GET_PARTNERS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/partners`);
    return response.data;
  })
);

export const getPartnerAction = createAsyncThunk<
  any,
  number,
  { rejectValue: { message: string } }
>(
  GET_PARTNER,
  asyncThunkErrorWrapper(async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/partners/${id}`);
    return response.data;
  })
);

interface AddPlanArgs {
  plan: any;
  partnerId: string;
}

export const addPlanAction = createAsyncThunk<
  any,
  AddPlanArgs,
  { rejectValue: { message: string } }
>(
  CREATE_PLAN,
  asyncThunkErrorWrapper(async (args: AddPlanArgs) => {
    const response = await axiosClient.post(
      `${API_ROOT}/partners/${args.partnerId}/plans`,
      args.plan
    );
    return response.data;
  })
);

interface AddPaymentPlanArgs {
  paymentPlan: any;
  partnerId: string;
}

export const addPaymentPlanAction = createAsyncThunk<
  any,
  AddPaymentPlanArgs,
  { rejectValue: { message: string } }
>(
  CREATE_PAYMENT_PLAN,
  asyncThunkErrorWrapper(async (args: AddPaymentPlanArgs) => {
    const response = await axiosClient.post(
      `${API_ROOT}/partners/${args.partnerId}/payment-plans`,
      args.paymentPlan
    );
    return response.data;
  })
);

export const getPlansAction = createAsyncThunk<
  any,
  number,
  { rejectValue: { message: string } }
>(
  GET_PLANS,
  asyncThunkErrorWrapper(async (partnerId: number) => {
    const response = await axiosClient.get(
      `${API_ROOT}/partners/${partnerId}/plans`
    );
    return response.data;
  })
);

export const getPaymentPlansAction = createAsyncThunk<
  any,
  number,
  { rejectValue: { message: string } }
>(
  GET_PAYMENT_PLANS,
  asyncThunkErrorWrapper(async (partnerId: number) => {
    const response = await axiosClient.get(
      `${API_ROOT}/partners/${partnerId}/payment-plans`
    );
    return response.data;
  })
);
