import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import settings from "../../config/settings";
import axiosClient from "../../config/axiosClient";
import { ApiResponseSuccess } from "@app-interfaces";
import { ICheckList } from "@app-models";

const CREATE_CHECK_LIST = "check_list:CREATE_CHECK_LIST";
const UPDATE_CHECK_LIST = "check_list:UPDATE_CHECK_LIST";
const DELETE_CHECK_LIST = "check_list:DELETE_CHECK_LIST";
const GET_CHECK_LISTS = "check_list:GET_CHECK_LISTS";
const GET_CHECK_LIST = "check_list:GET_CHECK_LIST";
const API_ROOT = settings.api.rest;

export const createCheckListAction = asyncThunkWrapper<
  ApiResponseSuccess<ICheckList>,
  any
>(CREATE_CHECK_LIST, async (args) => {
  const response = await axiosClient.post(`${API_ROOT}/checkLists`, args);
  return response.data;
});

export const updateCheckListAction = asyncThunkWrapper<
  ApiResponseSuccess<ICheckList>,
  any
>(UPDATE_CHECK_LIST, async (args) => {
  const response = await axiosClient.put(
    `${API_ROOT}/checkLists/${args.id}`,
    args
  );
  return response.data;
});

export const deleteCheckListAction = asyncThunkWrapper<
  ApiResponseSuccess<ICheckList>,
  number
>(DELETE_CHECK_LIST, async (id) => {
  const response = await axiosClient.delete(`${API_ROOT}/checkLists/${id}`);
  return response.data;
});

export const getCheckListsAction = asyncThunkWrapper<
  ApiResponseSuccess<ICheckList>,
  void
>(GET_CHECK_LISTS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/checkLists`);
  return response.data;
});

export const getCheckListAction = asyncThunkWrapper<
  ApiResponseSuccess<ICheckList>,
  number
>(GET_CHECK_LIST, async (id) => {
  const response = await axiosClient.get(`${API_ROOT}/checkLists/${id}`);
  return response.data;
});
