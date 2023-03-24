import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IPermission, IRole, IUser, IUserUpdate } from '@app-models';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';

const GET_USER = 'user:GET_USER';
const GET_USERS = 'user:GET_USERS';
const GET_PERMISSIONS = 'user:GET_PERMISSIONS';
const GET_ROLE = 'user:GET_ROLE';
const CREATE_ROLE = 'user:CREATE_ROLE';
const CREATE_USER = 'user:CREATE_USER';
const UPDATE_ROLE = 'user:UPDATE_ROLE';
const UPDATE_USER = 'user:UPDATE_USER';
const UPDATE_USER_STATUS = 'user:UPDATE_USER_STATUS';

const API_ROOT = settings.api.rest;

export const getUserAction = asyncThunkWrapper<ApiResponseSuccess<IUser>, number>(GET_USER, async id => {
  const response = await axiosClient.get(`${API_ROOT}/users/${id}`);

  return response.data;
});

export const getUsersAction = asyncThunkWrapper<ApiResponseSuccess<IUser>, void>(GET_USERS, async () => {
  const response = await axiosClient.get(`${API_ROOT}/users`);

  return response.data;
});

export const getPermissionsActions = asyncThunkWrapper<ApiResponseSuccess<IPermission>, void>(
  GET_PERMISSIONS,
  async () => {
    const response = await axiosClient.get(`${API_ROOT}/permissions`);

    return response.data;
  },
);

export const getRoleActions = asyncThunkWrapper<ApiResponseSuccess<IRole>, void>(GET_ROLE, async () => {
  const response = await axiosClient.get(`${API_ROOT}/roles`);

  return response.data;
});

export const createRoleAction = asyncThunkWrapper<ApiResponseSuccess<IRole>, { name: string; permissions: string[] }>(
  CREATE_ROLE,
  async data => {
    const response = await axiosClient.post(`${API_ROOT}/role`, data);

    return response.data;
  },
);

export const updateRoleAction = asyncThunkWrapper<ApiResponseSuccess<IRole>, { id: number; permissions: string[] }>(
  UPDATE_ROLE,
  async data => {
    const response = await axiosClient.patch(`${API_ROOT}/role`, data);

    return response.data;
  },
);

export const createUserAction = asyncThunkWrapper<
  ApiResponseSuccess<IUser>,
  {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    roleId: number;
  }
>(CREATE_USER, async data => {
  const response = await axiosClient.post(`${API_ROOT}/user`, data);

  return response.data;
});

export const updateUserAction = asyncThunkWrapper<ApiResponseSuccess<IUser>, IUserUpdate>(UPDATE_USER, async data => {
  const response = await axiosClient.put(`${API_ROOT}/user`, data);

  return response.data;
});

export const updateUserStatusAction = asyncThunkWrapper<ApiResponseSuccess<IUser>, { userId: number }>(
  UPDATE_USER_STATUS,
  async data => {
    const response = await axiosClient.put(`${API_ROOT}/user/${data.userId}/toggle-status`, data);

    return response.data;
  },
);
