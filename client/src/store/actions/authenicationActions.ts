import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../config/axiosClient";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";
import settings from "../../config/settings";

const SIGN_IN = "authentication:SIGN_IN";
const API_ROOT = settings.api.rest;

export const signInAction = createAsyncThunk(
  SIGN_IN,
  asyncThunkErrorWrapper(async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/sign-in`, args);

    return response.data;
  })
);
