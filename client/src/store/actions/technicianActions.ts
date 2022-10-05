import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import { ApiResponseSuccess } from "@app-interfaces";
import { ITechnician } from "@app-models";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";

const GET_TECHNICIANS = "technicians:GET_TECHNICIANS";
const GET_TECHNICIAN = "technicians:GET_TECHNICIAN";
const CREATE_TECHNICIAN = "technicians:CREATE_TECHNICIAN";
const UPDATE_TECHNICIAN = "technicians:UPDATE_TECHNICIAN";
const DELETE_TECHNICIAN = "technicians:DELETE_TECHNICIAN";

const API_ROOT = settings.api.rest;

export const getTechniciansAction = asyncThunkWrapper<
  ApiResponseSuccess<ITechnician>,
  void
>(GET_TECHNICIANS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/technicians`);

  return response.data;
});

export const getTechnicianAction = asyncThunkWrapper<
  ApiResponseSuccess<ITechnician>,
  number
>(GET_TECHNICIAN, async (techId) => {
  const response = await axiosClient.get(`${API_ROOT}/technicians/${techId}`);

  return response.data;
});

export const createTechnicianAction = asyncThunkWrapper<
  ApiResponseSuccess<ITechnician>,
  any
>(CREATE_TECHNICIAN, async (technician) => {
  const response = await axiosClient.post(
    `${API_ROOT}/technicians`,
    technician
  );

  return response.data;
});

export const updateTechnicianAction = asyncThunkWrapper<
  ApiResponseSuccess<ITechnician>,
  any
>(UPDATE_TECHNICIAN, async (technician) => {
  const response = await axiosClient.patch(
    `${API_ROOT}/technicians/${technician.id}`,
    technician
  );

  return response.data;
});

export const deleteTechnicianAction = asyncThunkWrapper<
  ApiResponseSuccess<ITechnician>,
  number
>(DELETE_TECHNICIAN, async (techId) => {
  const response = await axiosClient.delete(
    `${API_ROOT}/technicians/${techId}`
  );

  return response.data;
});
