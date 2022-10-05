import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import { ApiResponseSuccess } from "@app-interfaces";
import {
  ICustomerSubscription,
  IRideShareDriverSubscription,
} from "@app-models";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";

const GET_CUSTOMER_VEHICLE_SUBS = "vehicle:GET_CUSTOMER_VEHICLE_SUBS";
const GET_DRIVER_VEHICLE_SUBS = "vehicle:GET_DRIVER_VEHICLE_SUBS";
const API_ROOT = settings.api.rest;

export const getDriverVehicleSubscriptionAction = asyncThunkWrapper<
  ApiResponseSuccess<IRideShareDriverSubscription>,
  number
>(GET_DRIVER_VEHICLE_SUBS, async (id) => {
  const response = await axiosClient.get(
    `${API_ROOT}/vehicle/${id}/driver-subs`
  );

  return response.data;
});

export const getCustomerVehicleSubscriptionAction = asyncThunkWrapper<
  ApiResponseSuccess<ICustomerSubscription>,
  number
>(GET_CUSTOMER_VEHICLE_SUBS, async (id) => {
  const response = await axiosClient.get(
    `${API_ROOT}/vehicle/${id}/customer-subs`
  );

  return response.data;
});
