import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';
import { IServiceReminder } from '@app-models';
import { IReminderType } from '@app-models';

const CREATE_REMINDER_TYPE = 'reminder:CREATE_REMINDER_TYPE';
const UPDATE_REMINDER_TYPE = 'reminder:UPDATE_REMINDER_TYPE';
const GET_REMINDER_TYPE = 'reminder:GET_REMINDER_TYPE';
const CREATE_REMINDER = 'reminder:CREATE_REMINDER';
const UPDATE_REMINDER = 'reminder:UPDATE_REMINDER';
const GET_REMINDER = 'reminder:GET_REMINDER';
const DELETE_REMINDER = 'reminder:DELETE_REMINDER';
const UPDATE_REMINDER_STATUS = 'item:UPDATE_REMINDER_STATUS';
const RESET_LAST_SERVICE_DATE = 'item:RESET_LAST_SERVICE_DATE';
const API_ROOT = settings.api.rest;

export const createReminderTypeAction = asyncThunkWrapper<ApiResponseSuccess<IReminderType>, any>(
    CREATE_REMINDER_TYPE,
    async args => {
        const response = await axiosClient.post(`${API_ROOT}/reminder/type`, args);
        return response.data;
});

export const updateReminderTypeAction = asyncThunkWrapper<ApiResponseSuccess<IReminderType>, any>(
    UPDATE_REMINDER_TYPE,
    async args => {
        const response = await axiosClient.put(`${API_ROOT}/reminder/type/${args.id}`, args);
        return response.data;
});

export const getReminderTypesAction = asyncThunkWrapper<ApiResponseSuccess<IReminderType>, void>(GET_REMINDER_TYPE, async () => {
    const response = await axiosClient.get(`${API_ROOT}/reminder/types`);
    return response.data;
});

export const createReminderAction = asyncThunkWrapper<ApiResponseSuccess<IServiceReminder>, any>(
    CREATE_REMINDER,
    async args => {
        const response = await axiosClient.post(`${API_ROOT}/reminder`, args);
        return response.data;
});

export const updateReminderAction = asyncThunkWrapper<ApiResponseSuccess<IServiceReminder>, any>(
    UPDATE_REMINDER,
    async args => {
        const response = await axiosClient.patch(`${API_ROOT}/reminder/${args.id}`, args);
        return response.data;
});

export const resetLastDateAction = asyncThunkWrapper<ApiResponseSuccess<IServiceReminder>, any>(
    RESET_LAST_SERVICE_DATE,
    async args => {
        const response = await axiosClient.patch(`${API_ROOT}/reminder/reset/${args.id}`, args);
        return response.data;
});

export const getReminderAction = asyncThunkWrapper<ApiResponseSuccess<IServiceReminder>, void>(GET_REMINDER, async () => {
    const response = await axiosClient.get(`${API_ROOT}/reminders`);
    return response.data;
});

export const deleteReminderAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(DELETE_REMINDER, async id => {
    const response = await axiosClient.delete(`${API_ROOT}/reminder/${id}`);
    return response.data;
});

export const toggleReminderStatusAction = asyncThunkWrapper<ApiResponseSuccess<IServiceReminder>, { reminderId: number }>(
    UPDATE_REMINDER_STATUS,
    async data => {
      const response = await axiosClient.put(`${API_ROOT}/reminder/${data.reminderId}/toggle-status`, data);
      return response.data;
});