import { IThunkAPIStatus } from "@app-types";
import { createSlice } from "@reduxjs/toolkit";
import {
  addPaymentPlanAction,
  addPlanAction,
  createPartnerAction,
  getDriversFilterDataAction,
  getPartnerAction,
  getPartnersAction,
  getPaymentPlansAction,
  getPlansAction,
} from "../actions/partnerActions";
import { IPartner, IPaymentPlan, IPlan } from "@app-models";
import { IDriversFilterData } from "@app-interfaces";

interface IPartnerState {
  createPartnerStatus: IThunkAPIStatus;
  createPartnerSuccess: string;
  createPartnerError?: string;

  addPlanStatus: IThunkAPIStatus;
  addPlanSuccess: string;
  addPlanError?: string;

  addPaymentPlanStatus: IThunkAPIStatus;
  addPaymentPlanSuccess: string;
  addPaymentPlanError?: string;

  getPlansStatus: IThunkAPIStatus;
  getPlansSuccess: string;
  getPlansError?: string;

  getDriversFilterDataStatus: IThunkAPIStatus;
  getDriversFilterDataSuccess: string;
  getDriversFilterDataError?: string;

  getPaymentPlansStatus: IThunkAPIStatus;
  getPaymentPlansSuccess: string;
  getPaymentPlansError?: string;

  getPartnersStatus: IThunkAPIStatus;
  getPartnersSuccess: string;
  getPartnersError?: string;

  getPartnerStatus: IThunkAPIStatus;
  getPartnerSuccess: string;
  getPartnerError?: string;

  partner: IPartner | null;
  partners: IPartner[];
  plan: IPlan | null;
  paymentPlan: IPaymentPlan | null;
  plans: IPlan[];
  paymentPlans: IPaymentPlan[];
  driversFilterData: IDriversFilterData[];
}

const initialState: IPartnerState = {
  createPartnerError: "",
  createPartnerStatus: "idle",
  createPartnerSuccess: "",

  addPlanError: "",
  addPlanStatus: "idle",
  addPlanSuccess: "",

  addPaymentPlanError: "",
  addPaymentPlanStatus: "idle",
  addPaymentPlanSuccess: "",

  getPlansError: "",
  getPlansStatus: "idle",
  getPlansSuccess: "",

  getDriversFilterDataError: "",
  getDriversFilterDataStatus: "idle",
  getDriversFilterDataSuccess: "",

  getPaymentPlansError: "",
  getPaymentPlansStatus: "idle",
  getPaymentPlansSuccess: "",

  getPartnersError: "",
  getPartnersStatus: "idle",
  getPartnersSuccess: "",

  getPartnerError: "",
  getPartnerStatus: "idle",
  getPartnerSuccess: "",

  partner: null,
  partners: [],
  plan: null,
  paymentPlan: null,
  plans: [],
  paymentPlans: [],
  driversFilterData: [],
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
    clearGetPartnerStatus(state: IPartnerState) {
      state.getPartnerStatus = "idle";
      state.getPartnerSuccess = "";
      state.getPartnerError = "";
    },
    clearGetPlansStatus(state: IPartnerState) {
      state.getPlansStatus = "idle";
      state.getPlansSuccess = "";
      state.getPlansError = "";
    },
    clearGetPaymentPlansStatus(state: IPartnerState) {
      state.getPaymentPlansStatus = "idle";
      state.getPaymentPlansSuccess = "";
      state.getPaymentPlansError = "";
    },
    clearGetDriversFilterDataStatus(state: IPartnerState) {
      state.getDriversFilterDataStatus = "idle";
      state.getDriversFilterDataSuccess = "";
      state.getDriversFilterDataError = "";
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
        if (action.payload) {
          state.getPartnersError = action.payload.message;
        } else state.getPartnersError = action.error.message;
        state.getPartnersStatus = "failed";
      });

    builder
      .addCase(getPartnerAction.pending, (state) => {
        state.getPartnerStatus = "idle";
      })
      .addCase(getPartnerAction.fulfilled, (state, action) => {
        state.getPartnerStatus = "completed";
        state.partner = action.payload.result as IPartner;
      })
      .addCase(getPartnerAction.rejected, (state, action) => {
        state.getPartnerStatus = "failed";
        if (action.payload) {
          state.getPartnerError = action.payload.message;
        } else state.getPartnerError = action.error.message;
      });

    builder
      .addCase(addPlanAction.pending, (state) => {
        state.addPlanStatus = "idle";
      })
      .addCase(addPlanAction.fulfilled, (state, action) => {
        state.addPlanStatus = "completed";
        state.plans = action.payload.results as IPlan[];
      })
      .addCase(addPlanAction.rejected, (state, action) => {
        state.addPlanStatus = "failed";
        if (action.payload) {
          state.addPlanError = action.payload.message;
        } else state.addPlanError = action.error.message;
      });

    builder
      .addCase(getPlansAction.pending, (state) => {
        state.getPlansStatus = "idle";
      })
      .addCase(getPlansAction.fulfilled, (state, action) => {
        state.getPlansStatus = "completed";
        state.plans = action.payload.results as IPlan[];
      })
      .addCase(getPlansAction.rejected, (state, action) => {
        state.getPlansStatus = "failed";

        if (action.payload) {
          state.getPlansError = action.payload.message;
        } else state.getPlansError = action.error.message;
      });

    builder
      .addCase(addPaymentPlanAction.pending, (state) => {
        state.addPaymentPlanStatus = "idle";
      })
      .addCase(addPaymentPlanAction.fulfilled, (state, action) => {
        state.addPaymentPlanStatus = "completed";
        state.paymentPlans = action.payload.results as IPaymentPlan[];
      })
      .addCase(addPaymentPlanAction.rejected, (state, action) => {
        state.addPaymentPlanStatus = "failed";

        if (action.payload) {
          state.addPaymentPlanError = action.payload.message;
        } else state.addPaymentPlanError = action.error.message;
      });

    builder
      .addCase(getPaymentPlansAction.pending, (state) => {
        state.getPaymentPlansStatus = "idle";
      })
      .addCase(getPaymentPlansAction.fulfilled, (state, action) => {
        state.getPaymentPlansStatus = "completed";
        state.paymentPlans = action.payload.results as IPaymentPlan[];
      })
      .addCase(getPaymentPlansAction.rejected, (state, action) => {
        state.getPaymentPlansStatus = "failed";

        if (action.payload) {
          state.getPaymentPlansError = action.payload.message;
        } else state.getPaymentPlansError = action.error.message;
      });

    builder
      .addCase(getDriversFilterDataAction.pending, (state) => {
        state.getDriversFilterDataStatus = "idle";
      })
      .addCase(getDriversFilterDataAction.fulfilled, (state, action) => {
        state.getDriversFilterDataStatus = "completed";
        state.driversFilterData = action.payload
          .results as IDriversFilterData[];
      })
      .addCase(getDriversFilterDataAction.rejected, (state, action) => {
        state.getDriversFilterDataStatus = "failed";

        if (action.payload) {
          state.getDriversFilterDataError = action.payload.message;
        } else state.getDriversFilterDataError = action.error.message;
      });
  },
});

export const {
  clearCreatePartnerStatus,
  clearGetPartnersStatus,
  clearGetPartnerStatus,
  clearGetPaymentPlansStatus,
  clearGetPlansStatus,
  clearGetDriversFilterDataStatus,
} = partnerSlice.actions;

export default partnerSlice.reducer;
