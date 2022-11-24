import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IJob } from '@app-models';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import { AxiosResponse } from 'axios';

const GET_JOBS = 'jobs:GET_JOBS';
const GET_JOB = 'jobs:GET_JOB';
const ASSIGN_JOB = 'jobs:ASSIGN_JOB';
const CANCEL_JOB = 'jobs:CANCEL_JOB';
const REASSIGN_JOB = 'jobs:REASSIGN_JOB';
const APPROVE_JOB_CHECK_LIST = 'check_list:APPROVE_JOB_CHECK_LIST';
const UPLOAD_JOB_REPORT = 'check_list:UPLOAD_JOB_REPORT';
const API_ROOT = settings.api.rest;

export const getJobsAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, any>(GET_JOBS, async partnerId => {
  let response: AxiosResponse;

  if (partnerId) {
    response = await axiosClient.get(`${API_ROOT}/partners/${partnerId}/jobs`);
    return response.data;
  }

  response = await axiosClient.get(`${API_ROOT}/jobs`);
  return response.data;
});

export const getJobAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, number>(GET_JOB, async jobId => {
  const response = await axiosClient.get(`${API_ROOT}/jobs/${jobId}`);
  return response.data;
});

export const driverAssignJobAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, any>(ASSIGN_JOB, async args => {
  const response = await axiosClient.post(`${API_ROOT}/jobs/${args.partnerId}/assign`, args);
  return response.data;
});

export const cancelJobAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, any>(CANCEL_JOB, async args => {
  const response = await axiosClient.post(`${API_ROOT}/jobs/${args.partnerId}/cancel`, args.data);
  return response.data;
});

export const reassignJobAction = asyncThunkWrapper<ApiResponseSuccess<IJob>, any>(REASSIGN_JOB, async args => {
  const response = await axiosClient.post(`${API_ROOT}/jobs/${args.partnerId}/reassign`, args);
  return response.data;
});

export const approveJobCheckListAction = asyncThunkWrapper<
  ApiResponseSuccess<IJob>,
  { jobId: number; approved: boolean }
>(APPROVE_JOB_CHECK_LIST, async args => {
  const response = await axiosClient.patch(`${API_ROOT}/jobs/${args.jobId}/checkList`, args);
  return response.data;
});

export const uploadJobReportAction = asyncThunkWrapper<
  ApiResponseSuccess<void>,
  {
    file: any;
    jobId?: number;
  }
>(UPLOAD_JOB_REPORT, async args => {
  const formData = new FormData();

  formData.append('reportFileUrl', args.file);

  axiosClient.defaults.headers.post['Content-Type'] = args.file.type;

  const response = await axiosClient.patch(`${API_ROOT}/jobs/${args.jobId}/upload-report`, formData);

  return response.data;
});
