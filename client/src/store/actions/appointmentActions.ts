import settings from '../../config/settings';
import { createAsyncThunk } from '@reduxjs/toolkit';
import asyncThunkErrorWrapper from '../../helpers/asyncThunkErrorWrapper';
import axiosClient from '../../config/axiosClient';

const GET_APPOINTMENTS = 'appointment:GET_APPOINTMENTS';
const GET_APPOINTMENT = 'appointment:GET_APPOINTMENT';
const UPLOAD_FILE = 'appointment:UPLOAD_FILE';
const RESCHEDULE_APPOINTMENT = 'appointment:RESCHEDULE_APPOINTMENT';
const CREATE_APPOINTMENT = 'appointment:CREATE_APPOINTMENT';
const CANCEL_APPOINTMENT = 'appointment:CANCEL_APPOINTMENT';
const API_ROOT = settings.api.rest;

export const getAppointmentsAction = createAsyncThunk<any, void>(
  GET_APPOINTMENTS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/appointments`);
    return response.data;
  }),
);

export interface IAppointmentUpdate {
  inventory: File;
  report: File;
  estimate: File;
  appointmentId: number;
  status: string;
}

export const createAppointmentAction = createAsyncThunk<any, any, { rejectValue: { message: string } }>(
  CREATE_APPOINTMENT,
  asyncThunkErrorWrapper(async (appointment: any) => {
    const response = await axiosClient.post(`${API_ROOT}/appointments`, appointment);
    return response.data;
  }),
);

export const updateAppointmentAction = createAsyncThunk(
  UPLOAD_FILE,
  asyncThunkErrorWrapper(async (args: IAppointmentUpdate) => {
    const formData = new FormData();
    let contentType = '';

    if (args.estimate) {
      formData.append('estimate', args.estimate, args.estimate.name);
      contentType = args.estimate.type;
    }

    if (args.inventory) {
      formData.append('inventory', args.inventory, args.inventory.name);
      contentType = args.inventory.type;
    }

    if (args.report) {
      formData.append('report', args.report, args.report.name);
      contentType = args.report.type;
    }

    if (args.status) formData.append('status', args.status);

    const response = await axiosClient.patch(`${API_ROOT}/appointments/${args.appointmentId}`, formData, {
      headers: {
        'Content-Type': contentType,
      },
    });
    return response.data;
  }),
);

export const getAppointmentAction = createAsyncThunk<any, number>(
  GET_APPOINTMENT,
  asyncThunkErrorWrapper(async (id: number) => {
    const response = await axiosClient.get(`${API_ROOT}/appointments/${id}`);
    return response.data;
  }),
);

export const rescheduleInspectionAction = createAsyncThunk(
  RESCHEDULE_APPOINTMENT,
  asyncThunkErrorWrapper(async (args: any) => {
    const response = await axiosClient.patch(`${API_ROOT}/appointments/${args.id}/reschedule`, args.data);
    return response.data;
  }),
);

export const cancelInspectionAction = createAsyncThunk(
  CANCEL_APPOINTMENT,
  asyncThunkErrorWrapper(async (args: any) => {
    const response = await axiosClient.patch(`${API_ROOT}/appointments/${args.id}/cancel`, {
      customerId: args.customerId,
    });
    return response.data;
  }),
);
