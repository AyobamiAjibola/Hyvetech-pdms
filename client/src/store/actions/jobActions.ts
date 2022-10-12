import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import { ApiResponseSuccess } from "@app-interfaces";
import { IJob } from "@app-models";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import { AxiosResponse } from "axios";

const GET_JOBS = "jobs:GET_JOBS";
const GET_JOB = "jobs:GET_JOB";
const ASSIGN_JOB = "jobs:ASSIGN_JOB";
const API_ROOT = settings.api.rest;

export const getJobsAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, any>(
  GET_JOBS,
  async (partnerId) => {
    let response: AxiosResponse;

    if (partnerId) {
      response = await axiosClient.get(
        `${API_ROOT}/partners/${partnerId}/jobs`
      );
      return response.data;
    }

    response = await axiosClient.get(`${API_ROOT}/jobs`);
    return response.data;
  }
);

export const getJobAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, number>(
  GET_JOB,
  async (jobId) => {
    const response = await axiosClient.get(`${API_ROOT}/jobs/${jobId}`);
    return response.data;
  }
);

export const driverAssignJobAction = asyncThunkWrapper<
  ApiResponseSuccess<IJob>,
  any
>(ASSIGN_JOB, async (args) => {
  const response = await axiosClient.post(
    `${API_ROOT}/jobs/${args.partnerId}/driver-assign`,
    args
  );
  return response.data;
});
