import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import { ApiResponseSuccess } from "@app-interfaces";
import { IRideShareDriver } from "@app-models";

const GET_DRIVER = "ride_share:GET_DRIVER";
const API_ROOT = settings.api.rest;

export const getDriverAction = asyncThunkWrapper<
  ApiResponseSuccess<IRideShareDriver>,
  number
>(GET_DRIVER, async (id) => {
  const response = await axiosClient.get(`${API_ROOT}/ride-share/${id}/driver`);

  return response.data;
});
