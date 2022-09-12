import settings from "../../config/settings";
import { createAsyncThunk } from "@reduxjs/toolkit";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";
import axiosClient from "../../config/axiosClient";
import { ICreatePartnerModel } from "../../components/forms/models/partnerModel";

const CREATE_PARTNER = "partner:CREATE_PARTNER";
const GET_PARTNERS = "partner:GET_PARTNERS";
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
