import { createSlice } from '@reduxjs/toolkit';
import moment, { Moment } from 'moment';
import {
  disableTimeSlotAction,
  getCurrentDateAction,
  getTimeslotsAction,
  initCurrentTimeSlotsAction,
} from '../actions/timeSlotActions';
import { ISchedule, ITimeSlot } from '@app-models';
import { IThunkAPIStatus } from '@app-types';
import { IThunkAPIPayloadError } from '@app-interfaces';

interface ITimeSlotState {
  getTimeSlotsStatus: IThunkAPIStatus;
  getTimeSlotsError: string;

  initTimeSlotsStatus: IThunkAPIStatus;
  initTimeSlotsError: string;

  disablingTimeSlotStatus: IThunkAPIStatus;
  disablingTimeSlotError: string;

  fetchingCurrentDateStatus: IThunkAPIStatus;
  fetchingCurrentDateError: string;

  timeSlot: ISchedule | null;
  shortDate: string;
  fullDate: string;
  slots: ITimeSlot[];
}

const initialState: ITimeSlotState = {
  getTimeSlotsStatus: 'idle',
  getTimeSlotsError: '',

  initTimeSlotsStatus: 'idle',
  initTimeSlotsError: '',

  disablingTimeSlotStatus: 'idle',
  disablingTimeSlotError: '',

  fetchingCurrentDateStatus: 'idle',
  fetchingCurrentDateError: '',

  timeSlot: null,
  shortDate: '',
  fullDate: '',
  slots: [],
};

const timeSlotSlice = createSlice({
  name: 'timeSlot',
  initialState,
  reducers: {
    clearInitTimeslots(state: ITimeSlotState) {
      state.initTimeSlotsStatus = 'idle';
      state.initTimeSlotsError = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getTimeslotsAction.pending, state => {
        state.getTimeSlotsStatus = 'loading';
      })
      .addCase(getTimeslotsAction.fulfilled, (state, action) => {
        state.getTimeSlotsStatus = 'completed';
        state.timeSlot = action.payload.result as ISchedule;

        state.slots = state.timeSlot.timeSlots;
      })
      .addCase(getTimeslotsAction.rejected, (state, action) => {
        state.getTimeSlotsStatus = 'failed';

        const payload = <IThunkAPIPayloadError>action.payload;
        state.getTimeSlotsError = action.payload ? payload.message : <string>action.error.message;
      });

    builder
      .addCase(initCurrentTimeSlotsAction.pending, state => {
        state.initTimeSlotsStatus = 'loading';
      })
      .addCase(initCurrentTimeSlotsAction.fulfilled, (state, action) => {
        state.initTimeSlotsStatus = 'completed';
        state.timeSlot = action.payload.timeSlot as ISchedule;
        state.slots = action.payload.slots as ITimeSlot[];

        //Decide which date to disable, given that it has already been selected
        const now = action.payload.date ? moment(action.payload.date) : moment();

        let tempSlots = [...state.slots];

        tempSlots = setExpiredTimeSlot(tempSlots, now);

        state.slots = tempSlots;
      })
      .addCase(initCurrentTimeSlotsAction.rejected, (state, action) => {
        state.initTimeSlotsStatus = 'failed';

        const payload = <IThunkAPIPayloadError>action.payload;
        state.initTimeSlotsError = action.payload ? payload.message : <string>action.error.message;
      });

    builder
      .addCase(disableTimeSlotAction.pending, state => {
        state.disablingTimeSlotStatus = 'loading';
      })
      .addCase(disableTimeSlotAction.fulfilled, (state, action) => {
        state.disablingTimeSlotStatus = 'completed';
        state.timeSlot = action.payload.timeSlot;
        state.slots = action.payload.timeSlot.slots;
      })
      .addCase(disableTimeSlotAction.rejected, (state, action) => {
        state.disablingTimeSlotStatus = 'failed';
        const payload = <IThunkAPIPayloadError>action.payload;
        state.disablingTimeSlotError = action.payload ? payload.message : <string>action.error.message;
      });

    builder
      .addCase(getCurrentDateAction.pending, state => {
        state.fetchingCurrentDateStatus = 'loading';
      })
      .addCase(getCurrentDateAction.fulfilled, (state, action) => {
        state.fetchingCurrentDateStatus = 'completed';
        state.shortDate = action.payload.shortDate;
        state.fullDate = action.payload.fullDate;
      })
      .addCase(getCurrentDateAction.rejected, (state, action) => {
        state.fetchingCurrentDateStatus = 'failed';
        const payload = <IThunkAPIPayloadError>action.payload;
        state.fetchingCurrentDateError = action.payload ? payload.message : <string>action.error.message;
      });
  },
});

const setExpiredTimeSlot = (slots: ITimeSlot[], currentDate: Moment) => {
  return slots.map((slot: any) => {
    const _slots = slot.time.split('-');
    const slotTime = moment(_slots[0].trim(), 'HH: a');

    const currentSlot = moment({
      year: currentDate.year(),
      month: currentDate.month(),
      date: currentDate.date(),
      hours: slotTime.hours(),
    });

    if (!currentDate.isBefore(currentSlot)) {
      slot['available'] = currentDate.isBefore(currentSlot);
    }

    return slot;
  });
};

export const { clearInitTimeslots } = timeSlotSlice.actions;
export default timeSlotSlice.reducer;
