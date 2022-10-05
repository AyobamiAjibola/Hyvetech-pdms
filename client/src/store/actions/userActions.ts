import asyncThunkWrapper from "../../helpers/asyncThunkWrapper";
import { ApiResponseSuccess } from "@app-interfaces";
import { IUser } from "@app-models";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";

const GET_USER = "user:GET_USER";
const GET_USERS = "user:GET_USERS";
const API_ROOT = settings.api.rest;

export const getUserAction = asyncThunkWrapper<
  ApiResponseSuccess<IUser>,
  number
>(GET_USER, async (id) => {
  const response = await axiosClient.get(`${API_ROOT}/users/${id}`);

  return response.data;
});

export const getUsersAction = asyncThunkWrapper<
  ApiResponseSuccess<IUser>,
  void
>(GET_USERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/users`);

  return response.data;
});
