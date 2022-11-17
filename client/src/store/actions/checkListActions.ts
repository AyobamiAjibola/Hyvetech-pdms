import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import { ApiResponseSuccess, IImageButtonData } from '@app-interfaces';
import { ICheckList } from '@app-models';
import { CheckListQuestionType, CheckListType } from '@app-types';

const CREATE_CHECK_LIST = 'check_list:CREATE_CHECK_LIST';
const UPDATE_CHECK_LIST = 'check_list:UPDATE_CHECK_LIST';
const DELETE_CHECK_LIST = 'check_list:DELETE_CHECK_LIST';
const GET_CHECK_LISTS = 'check_list:GET_CHECK_LISTS';
const GET_CHECK_LIST = 'check_list:GET_CHECK_LIST';
const CREATE_JOB_CHECK_LIST = 'check_list:CREATE_JOB_CHECK_LIST';
const UPDATE_JOB_CHECK_LIST = 'check_list:UPDATE_JOB_CHECK_LIST';
const API_ROOT = settings.api.rest;

export const createCheckListAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, any>(
  CREATE_CHECK_LIST,
  async args => {
    const response = await axiosClient.post(`${API_ROOT}/checkLists`, args);
    return response.data;
  },
);

export const updateCheckListAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, any>(
  UPDATE_CHECK_LIST,
  async args => {
    const response = await axiosClient.put(`${API_ROOT}/checkLists/${args.id}`, args.data);
    return response.data;
  },
);

export const deleteCheckListAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, number>(
  DELETE_CHECK_LIST,
  async id => {
    const response = await axiosClient.delete(`${API_ROOT}/checkLists/${id}`);
    return response.data;
  },
);

export const getCheckListsAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, void>(
  GET_CHECK_LISTS,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/checkLists`);
    return response.data;
  },
);

export const getCheckListAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, number>(
  GET_CHECK_LIST,
  async id => {
    const response = await axiosClient.get(`${API_ROOT}/checkLists/${id}`);
    return response.data;
  },
);

interface IUpdateCheckList {
  id: number;
  data: string;
}

export const updateJobCheckListAction = asyncThunkWrapper<ApiResponseSuccess<ICheckList>, IUpdateCheckList>(
  UPDATE_JOB_CHECK_LIST,
  async args => {
    const response = await axiosClient.patch(`${API_ROOT}/checkLists/${args.id}`, args.data);
    return response.data;
  },
);

interface ICreateJobCheckList {
  jobId: number;
  checkList: CheckListType;
}

export const createJobCheckListAction = asyncThunkWrapper<ApiResponseSuccess<any>, ICreateJobCheckList>(
  CREATE_JOB_CHECK_LIST,
  async ({ jobId, checkList }) => {
    axiosClient.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    const formData = new FormData();
    const files: File[] = [];
    const questions: CheckListQuestionType[] = [];
    const images: IImageButtonData[] = [];
    const sections = checkList.sections;

    for (const section of sections) {
      for (const question of section.questions) questions.push(question);
    }

    for (const question of questions)
      if (question.images) {
        for (const image of question.images) {
          images.push(image);
        }
      }

    for (const image of images)
      files.push(
        await fetch(image.url)
          .then(r => r.blob())
          .then(blobFile => new File([blobFile], image.title, { type: 'image/png' })),
      );

    for (const file of files) formData.append(file.name, file);
    formData.append('checkList', JSON.stringify(checkList));

    const response = await axiosClient.post(`${API_ROOT}/checkLists/${jobId}`, formData);

    return response.data;
  },
);
