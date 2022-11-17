import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import { ApiResponseSuccess } from "@app-interfaces";
import { IAppointment, IRideShareDriver, ITransaction, IVehicle } from "@app-models";

const GET_DRIVER = "ride-share:GET_DRIVER";
const GET_DRIVERS = "ride-share:GET_DRIVERS";
const GET_DRIVER_VEHICLES = "ride-share:GET_DRIVER_VEHICLES";
const GET_DRIVER_APPOINTMENTS = "ride-share:GET_DRIVER_APPOINTMENTS";
const GET_DRIVER_TRANSACTIONS = "ride-share:GET_DRIVER_TRANSACTIONS";
const DELETE_DRIVER = "ride-share:DELETE_DRIVER";
const API_ROOT = settings.api.rest;

export const getDriverAction = asyncThunkWrapper<ApiResponseSuccess<IRideShareDriver>, number>(
  GET_DRIVER,
  async (id) => {
    const response = await axiosClient.get(`${API_ROOT}/ride-share/${id}/driver`);

    return response.data;
  }
);

export const getDriversAction = asyncThunkWrapper<ApiResponseSuccess<IRideShareDriver>, void>(GET_DRIVERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/ride-share`);
  return response.data;
});

export const getDriverVehiclesAction = asyncThunkWrapper<ApiResponseSuccess<IVehicle>, number>(
  GET_DRIVER_VEHICLES,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/ride-share/${id}/vehicles`);
    return response.data;
  }
);

export const getDriverAppointmentsAction = asyncThunkWrapper<ApiResponseSuccess<IAppointment>, number>(
  GET_DRIVER_APPOINTMENTS,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/ride-share/${id}/appointments`);
    return response.data;
  }
);

export const getDriverTransactionsAction = asyncThunkWrapper<ApiResponseSuccess<ITransaction>, number>(
  GET_DRIVER_TRANSACTIONS,
  async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/ride-share/${id}/transactions`);
    return response.data;
  }
);

export const deleteDriverAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(
  DELETE_DRIVER,
  async (id: number) => {
    const response = await axiosClient.delete(`${API_ROOT}/ride-share/${id}`);
    return response.data;
  }
);
