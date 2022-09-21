import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import {
  createAppointmentAction,
  getAppointmentAction,
  getAppointmentsAction,
  updateAppointmentAction,
} from "../actions/appointmentActions";
import { IAppointment } from "@app-models";

interface IAppointmentState {
  getAppointmentsStatus: IThunkAPIStatus;
  getAppointmentsSuccess: string;
  getAppointmentsError: string;

  getAppointmentStatus: IThunkAPIStatus;
  getAppointmentSuccess: string;
  getAppointmentError: string;

  createAppointmentStatus: IThunkAPIStatus;
  createAppointmentSuccess: string;
  createAppointmentError: string;

  updateAppointmentStatus: IThunkAPIStatus;
  updateAppointmentSuccess: string;
  updateAppointmentError: string;

  appointments: IAppointment[];
  appointment: IAppointment | null;
}

const initialState: IAppointmentState = {
  getAppointmentsStatus: "idle",
  getAppointmentsSuccess: "",
  getAppointmentsError: "",

  getAppointmentStatus: "idle",
  getAppointmentSuccess: "",
  getAppointmentError: "",

  createAppointmentStatus: "idle",
  createAppointmentSuccess: "",
  createAppointmentError: "",

  updateAppointmentStatus: "idle",
  updateAppointmentSuccess: "",
  updateAppointmentError: "",

  appointments: [],
  appointment: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearGetAppointmentsStatus(state: IAppointmentState) {
      state.getAppointmentsStatus = "idle";
      state.getAppointmentsSuccess = "";
      state.getAppointmentsError = "";
    },
    clearGetAppointmentStatus(state: IAppointmentState) {
      state.getAppointmentStatus = "idle";
      state.getAppointmentSuccess = "";
      state.getAppointmentError = "";
    },
    clearUpdateAppointmentsStatus(state: IAppointmentState) {
      state.updateAppointmentStatus = "idle";
      state.updateAppointmentSuccess = "";
      state.updateAppointmentError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentsAction.pending, (state) => {
        state.getAppointmentsStatus = "loading";
      })
      .addCase(getAppointmentsAction.fulfilled, (state, action) => {
        state.getAppointmentsStatus = "completed";
        state.getAppointmentsSuccess = action.payload.message;
        state.appointments = action.payload.results as IAppointment[];
      })
      .addCase(getAppointmentsAction.rejected, (state, action) => {
        state.getAppointmentsStatus = "failed";
        state.getAppointmentsError = <string>action.error.message;
      });

    builder
      .addCase(createAppointmentAction.pending, (state) => {
        state.createAppointmentStatus = "loading";
      })
      .addCase(createAppointmentAction.fulfilled, (state, action) => {
        state.createAppointmentStatus = "completed";
        state.createAppointmentSuccess = action.payload.message;
      })
      .addCase(createAppointmentAction.rejected, (state, action) => {
        state.createAppointmentStatus = "failed";

        if (action.payload) {
          state.createAppointmentError = action.payload.message;
        } else state.createAppointmentError = <string>action.error.message;
      });

    builder
      .addCase(getAppointmentAction.pending, (state) => {
        state.getAppointmentStatus = "loading";
      })
      .addCase(getAppointmentAction.fulfilled, (state, action) => {
        state.getAppointmentStatus = "completed";
        state.getAppointmentSuccess = action.payload.message;
        state.appointment = action.payload.result as IAppointment;
      })
      .addCase(getAppointmentAction.rejected, (state, action) => {
        state.getAppointmentStatus = "failed";
        state.getAppointmentError = <string>action.error.message;
      });

    builder
      .addCase(updateAppointmentAction.pending, (state) => {
        state.updateAppointmentStatus = "loading";
      })
      .addCase(updateAppointmentAction.fulfilled, (state, action) => {
        state.updateAppointmentStatus = "completed";
        state.updateAppointmentSuccess = action.payload.message;
        state.appointment = action.payload.result as IAppointment;
      })
      .addCase(updateAppointmentAction.rejected, (state, action) => {
        state.updateAppointmentStatus = "failed";
        state.updateAppointmentError = <string>action.error.message;
      });
  },
});

export const {
  clearGetAppointmentsStatus,
  clearUpdateAppointmentsStatus,
  clearGetAppointmentStatus,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
