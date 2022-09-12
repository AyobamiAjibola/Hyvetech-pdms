import { IThunkAPIStatus } from "@app-types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createPartnerAction,
  getPartnersAction,
} from "../actions/partnerActions";
import { IPartner } from "@app-models";

interface IPartnerState {
  createPartnerStatus: IThunkAPIStatus;
  createPartnerSuccess: string;
  createPartnerError?: string;

  getPartnersStatus: IThunkAPIStatus;
  getPartnersSuccess: string;
  getPartnersError?: string;

  partner: IPartner | null;
  partners: IPartner[];
}

const initialState: IPartnerState = {
  createPartnerError: "",
  createPartnerStatus: "idle",
  createPartnerSuccess: "",

  getPartnersError: "",
  getPartnersStatus: "idle",
  getPartnersSuccess: "",

  partner: null,
  partners: [],
};

const partnerSlice = createSlice({
  name: "miscellaneous",
  initialState,
  reducers: {
    clearCreatePartnerStatus(state: IPartnerState) {
      state.createPartnerStatus = "idle";
      state.createPartnerSuccess = "";
      state.createPartnerError = "";
    },
    clearGetPartnersStatus(state: IPartnerState) {
      state.getPartnersStatus = "idle";
      state.getPartnersSuccess = "";
      state.getPartnersError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPartnerAction.pending, (state) => {
        state.createPartnerStatus = "loading";
      })
      .addCase(createPartnerAction.fulfilled, (state, action) => {
        state.createPartnerStatus = "completed";
        state.createPartnerSuccess = action.payload.message;
        state.partner = action.payload.result as IPartner;
      })
      .addCase(createPartnerAction.rejected, (state, action) => {
        state.createPartnerStatus = "failed";
        if (action.payload) {
          state.createPartnerError = action.payload.message;
        } else state.createPartnerError = action.error.message;
      });

    builder
      .addCase(getPartnersAction.pending, (state) => {
        state.getPartnersStatus = "loading";
      })
      .addCase(getPartnersAction.fulfilled, (state, action) => {
        state.getPartnersStatus = "completed";
        state.getPartnersSuccess = action.payload.message;
        state.partners = action.payload.results as IPartner[];
      })
      .addCase(getPartnersAction.rejected, (state, action) => {
        state.getPartnersStatus = "failed";
        if (action.payload) {
          state.getPartnersError = action.payload.message;
        } else state.getPartnersError = action.error.message;
      });
  },
});

export const { clearCreatePartnerStatus, clearGetPartnersStatus } =
  partnerSlice.actions;

export default partnerSlice.reducer;
