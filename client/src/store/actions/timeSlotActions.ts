import { createAsyncThunk } from "@reduxjs/toolkit";
import settings from "../../config/settings";

import getIndexDB from "../../db";
import axiosClient from "../../config/axiosClient";
import asyncThunkErrorWrapper from "../../helpers/asyncThunkErrorWrapper";

const GET_TIME_SLOTS = "timeslot:GET_TIME_SLOTS";
const INIT_TIME_SLOT = "timeslot:INIT_TIME_SLOT";
const DISABLE_TIME_SLOTS = "timeslot:DISABLE_TIME_SLOTS";
const GET_CURRENT_DATE = "timeslot:GET_CURRENT_DATE";
const API_ROOT = settings.api.rest;

const db = getIndexDB();

export const getTimeslotsAction = createAsyncThunk(
  GET_TIME_SLOTS,
  asyncThunkErrorWrapper(async () => {
    const response = await axiosClient.get(`${API_ROOT}/timeslots`);
    return response.data;
  })
);

export const initCurrentTimeSlotsAction = createAsyncThunk(
  INIT_TIME_SLOT,
  asyncThunkErrorWrapper(async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/timeslots`, args);

    const timeSlot = response.data.result;

    if (args.now) {
      return { timeSlot, slots: timeSlot.slots };
    }
    return { date: args.date, timeSlot, slots: timeSlot.slots };
  })
);

export const disableTimeSlotAction = createAsyncThunk(
  DISABLE_TIME_SLOTS,
  asyncThunkErrorWrapper(async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/timeslots`, args);

    if (args.now) {
      return { timeSlot: response.data.disableTimeSlot };
    }
    return { date: args.date, timeSlot: response.data.disableTimeSlot };
  })
);

export const getCurrentDateAction = createAsyncThunk(
  GET_CURRENT_DATE,
  asyncThunkErrorWrapper(async (args: any) => {
    const currentDate = await _getCurrentDateFromDB(args.shortDate);

    if (currentDate.length) return currentDate[0];

    await db.table("timeSlots").add({
      shortDate: args.shortDate,
      fullDate: args.fullDate,
    });

    return _getCurrentDateFromDB(args.shortDate);
  })
);

const _getCurrentDateFromDB = async (shortDate: string) => {
  return db
    .table("timeSlots")
    .where("shortDate")
    .equalsIgnoreCase(shortDate)
    .toArray();
};
