import { IThunkAPIStatus } from "@app-types";
import { createSlice } from "@reduxjs/toolkit";
import {
  addPaymentPlanAction,
  addPlanAction,
  createPartnerAction,
  createPartnerKycAction,
  createPartnerSettingsAction,
  deletePartnerAction,
  deletePaymentPlanAction,
  deletePlanAction,
  getDriversFilterDataAction,
  getOwnersFilterDataAction,
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

  deletePartnerStatus: IThunkAPIStatus;
  deletePartnerSuccess: string;
  deletePartnerError?: string;

  createPartnerKycStatus: IThunkAPIStatus;
  createPartnerKycSuccess: string;
  createPartnerKycError?: string;

  createPartnerSettingsStatus: IThunkAPIStatus;
  createPartnerSettingsSuccess: string;
  createPartnerSettingsError?: string;

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

  getOwnersFilterDataStatus: IThunkAPIStatus;
  getOwnersFilterDataSuccess: string;
  getOwnersFilterDataError?: string;

  getPaymentPlansStatus: IThunkAPIStatus;
  getPaymentPlansSuccess: string;
  getPaymentPlansError?: string;

  getPartnersStatus: IThunkAPIStatus;
  getPartnersSuccess: string;
  getPartnersError?: string;

  getPartnerStatus: IThunkAPIStatus;
  getPartnerSuccess: string;
  getPartnerError?: string;

  deletePlanStatus: IThunkAPIStatus;
  deletePlanSuccess: string;
  deletePlanError?: string;

  deletePaymentPlanStatus: IThunkAPIStatus;
  deletePaymentPlanSuccess: string;
  deletePaymentPlanError?: string;

  partner: IPartner | null;
  partners: IPartner[];
  plan: IPlan | null;
  paymentPlan: IPaymentPlan | null;
  plans: IPlan[];
  paymentPlans: IPaymentPlan[];
  driversFilterData: IDriversFilterData[];
  ownersFilterData: IDriversFilterData[];
}

const initialState: IPartnerState = {
  createPartnerError: "",
  createPartnerStatus: "idle",
  createPartnerSuccess: "",

  deletePartnerError: "",
  deletePartnerStatus: "idle",
  deletePartnerSuccess: "",

  createPartnerKycError: "",
  createPartnerKycStatus: "idle",
  createPartnerKycSuccess: "",

  createPartnerSettingsError: "",
  createPartnerSettingsStatus: "idle",
  createPartnerSettingsSuccess: "",

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

  getOwnersFilterDataError: "",
  getOwnersFilterDataStatus: "idle",
  getOwnersFilterDataSuccess: "",

  getPaymentPlansError: "",
  getPaymentPlansStatus: "idle",
  getPaymentPlansSuccess: "",

  getPartnersError: "",
  getPartnersStatus: "idle",
  getPartnersSuccess: "",

  getPartnerError: "",
  getPartnerStatus: "idle",
  getPartnerSuccess: "",

  deletePlanError: "",
  deletePlanStatus: "idle",
  deletePlanSuccess: "",

  deletePaymentPlanError: "",
  deletePaymentPlanStatus: "idle",
  deletePaymentPlanSuccess: "",

  partner: null,
  partners: [],
  plan: null,
  paymentPlan: null,
  plans: [],
  paymentPlans: [],
  driversFilterData: [],
  ownersFilterData: [],
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

    clearDeletePartnerStatus(state: IPartnerState) {
      state.deletePartnerStatus = "idle";
      state.deletePartnerSuccess = "";
      state.deletePartnerError = "";
    },
    clearCreatePartnerKycStatus(state: IPartnerState) {
      state.createPartnerKycStatus = "idle";
      state.createPartnerKycSuccess = "";
      state.createPartnerKycError = "";
    },
    clearCreatePartnerSettingsStatus(state: IPartnerState) {
      state.createPartnerSettingsStatus = "idle";
      state.createPartnerSettingsSuccess = "";
      state.createPartnerSettingsError = "";
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

    clearDeletePlanStatus(state: IPartnerState) {
      state.deletePlanStatus = "idle";
      state.deletePlanSuccess = "";
      state.deletePlanError = "";
    },

    clearDeletePaymentPlanStatus(state: IPartnerState) {
      state.deletePaymentPlanStatus = "idle";
      state.deletePaymentPlanSuccess = "";
      state.deletePaymentPlanError = "";
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
      .addCase(deletePartnerAction.pending, (state) => {
        state.deletePartnerStatus = "loading";
      })
      .addCase(deletePartnerAction.fulfilled, (state, action) => {
        state.deletePartnerStatus = "completed";
        state.deletePartnerSuccess = action.payload.message;
      })
      .addCase(deletePartnerAction.rejected, (state, action) => {
        state.deletePartnerStatus = "failed";
        if (action.payload) {
          state.deletePartnerError = action.payload.message;
        } else state.deletePartnerError = action.error.message;
      });

    builder
      .addCase(createPartnerKycAction.pending, (state) => {
        state.createPartnerKycStatus = "loading";
      })
      .addCase(createPartnerKycAction.fulfilled, (state, action) => {
        state.createPartnerKycStatus = "completed";
        state.createPartnerKycSuccess = action.payload.message;
        state.partner = action.payload.result as IPartner;
      })
      .addCase(createPartnerKycAction.rejected, (state, action) => {
        state.createPartnerKycStatus = "failed";
        if (action.payload) {
          state.createPartnerKycError = action.payload.message;
        } else state.createPartnerKycError = action.error.message;
      });

    builder
      .addCase(createPartnerSettingsAction.pending, (state) => {
        state.createPartnerSettingsStatus = "loading";
      })
      .addCase(createPartnerSettingsAction.fulfilled, (state, action) => {
        state.createPartnerSettingsStatus = "completed";
        state.createPartnerSettingsSuccess = action.payload.message;
        state.partner = action.payload.result as IPartner;
      })
      .addCase(createPartnerSettingsAction.rejected, (state, action) => {
        state.createPartnerSettingsStatus = "failed";
        if (action.payload) {
          state.createPartnerSettingsError = action.payload.message;
        } else state.createPartnerSettingsError = action.error.message;
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
        state.getPartnerStatus = "loading";
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
        state.addPlanStatus = "loading";
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
        state.getPlansStatus = "loading";
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
        state.addPaymentPlanStatus = "loading";
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
        state.getPaymentPlansStatus = "loading";
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
        state.getDriversFilterDataStatus = "loading";
      })
      .addCase(getDriversFilterDataAction.fulfilled, (state, action) => {
        state.getDriversFilterDataStatus = "completed";
        state.driversFilterData = action.payload.results as IDriversFilterData[];
      })
      .addCase(getDriversFilterDataAction.rejected, (state, action) => {
        state.getDriversFilterDataStatus = "failed";

        if (action.payload) {
          state.getDriversFilterDataError = action.payload.message;
        } else state.getDriversFilterDataError = action.error.message;
      });

    builder
      .addCase(getOwnersFilterDataAction.pending, (state) => {
        state.getOwnersFilterDataStatus = "loading";
      })
      .addCase(getOwnersFilterDataAction.fulfilled, (state, action) => {
        state.getOwnersFilterDataStatus = "completed";
        state.ownersFilterData = action.payload.results as IDriversFilterData[];
      })
      .addCase(getOwnersFilterDataAction.rejected, (state, action) => {
        state.getOwnersFilterDataStatus = "failed";

        if (action.payload) {
          state.getOwnersFilterDataError = action.payload.message;
        } else state.getOwnersFilterDataError = action.error.message;
      });

    builder
      .addCase(deletePlanAction.pending, (state) => {
        state.deletePlanStatus = "loading";
      })
      .addCase(deletePlanAction.fulfilled, (state, action) => {
        state.deletePlanStatus = "completed";
        state.deletePlanSuccess = action.payload.message;
        state.plan = action.payload.result as IPlan;

        if (state.plan) {
          const _plan = state.plan;
          let plans = [...state.plans];
          plans = plans.filter((plan) => plan.id !== _plan.id);
          state.plans = plans;
        }
      })
      .addCase(deletePlanAction.rejected, (state, action) => {
        state.deletePlanStatus = "failed";

        if (action.payload) {
          state.deletePlanError = action.payload.message;
        } else state.deletePlanError = action.error.message;
      });

    builder
      .addCase(deletePaymentPlanAction.pending, (state) => {
        state.deletePaymentPlanStatus = "loading";
      })
      .addCase(deletePaymentPlanAction.fulfilled, (state, action) => {
        state.deletePaymentPlanStatus = "completed";
        state.deletePaymentPlanSuccess = action.payload.message;
        state.paymentPlan = action.payload.result as IPaymentPlan;

        if (state.paymentPlan) {
          const _paymentPlan = state.paymentPlan;
          let paymentPlans = [...state.paymentPlans];
          paymentPlans = paymentPlans.filter((paymentPlan) => paymentPlan.id !== _paymentPlan.id);
          state.paymentPlans = paymentPlans;
        }
      })
      .addCase(deletePaymentPlanAction.rejected, (state, action) => {
        state.deletePaymentPlanStatus = "failed";

        if (action.payload) {
          state.deletePaymentPlanError = action.payload.message;
        } else state.deletePaymentPlanError = action.error.message;
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
  clearCreatePartnerKycStatus,
  clearCreatePartnerSettingsStatus,
  clearDeletePaymentPlanStatus,
  clearDeletePlanStatus,
  clearDeletePartnerStatus,
} = partnerSlice.actions;

export default partnerSlice.reducer;
