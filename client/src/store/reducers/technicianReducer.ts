import { createSlice } from "@reduxjs/toolkit";
import { IThunkAPIStatus } from "@app-types";
import {
  createTechnicianAction,
  deleteTechnicianAction,
  getTechnicianAction,
  getTechniciansAction,
  updateTechnicianAction,
} from "../actions/technicianActions";
import { ITechnician } from "@app-models";

interface ITechnicianState {
  createTechnicianStatus: IThunkAPIStatus;
  createTechnicianSuccess: string;
  createTechnicianError?: string;

  updateTechnicianStatus: IThunkAPIStatus;
  updateTechnicianSuccess: string;
  updateTechnicianError?: string;

  deleteTechnicianStatus: IThunkAPIStatus;
  deleteTechnicianSuccess: string;
  deleteTechnicianError?: string;

  getTechnicianStatus: IThunkAPIStatus;
  getTechnicianSuccess: string;
  getTechnicianError?: string;

  getTechniciansStatus: IThunkAPIStatus;
  getTechniciansSuccess: string;
  getTechniciansError?: string;

  technician: ITechnician | null;
  technicians: ITechnician[];
}

const initialState: ITechnicianState = {
  technician: null,
  technicians: [],
  createTechnicianError: "",
  createTechnicianStatus: "idle",
  createTechnicianSuccess: "",
  deleteTechnicianError: "",
  deleteTechnicianStatus: "idle",
  deleteTechnicianSuccess: "",
  getTechnicianError: "",
  getTechnicianStatus: "idle",
  getTechnicianSuccess: "",
  getTechniciansError: "",
  getTechniciansStatus: "idle",
  getTechniciansSuccess: "",
  updateTechnicianError: "",
  updateTechnicianStatus: "idle",
  updateTechnicianSuccess: "",
};

const technicianSlice = createSlice({
  name: "technicians",
  initialState,
  reducers: {
    clearCreateTechnicianStatus(state: ITechnicianState) {
      state.createTechnicianError = "";
      state.createTechnicianStatus = "idle";
      state.createTechnicianSuccess = "";
    },

    clearUpdateTechnicianStatus(state: ITechnicianState) {
      state.updateTechnicianError = "";
      state.updateTechnicianStatus = "idle";
      state.updateTechnicianSuccess = "";
    },

    clearDeleteTechnicianStatus(state: ITechnicianState) {
      state.deleteTechnicianError = "";
      state.deleteTechnicianStatus = "idle";
      state.deleteTechnicianSuccess = "";
    },

    clearGetTechnicianStatus(state: ITechnicianState) {
      state.getTechnicianError = "";
      state.getTechnicianStatus = "idle";
      state.getTechnicianSuccess = "";
    },

    clearGetTechniciansStatus(state: ITechnicianState) {
      state.getTechniciansError = "";
      state.getTechniciansStatus = "idle";
      state.getTechniciansSuccess = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTechnicianAction.pending, (state) => {
        state.createTechnicianStatus = "loading";
      })
      .addCase(createTechnicianAction.fulfilled, (state, action) => {
        state.createTechnicianStatus = "completed";
        state.createTechnicianSuccess = action.payload.message;
        state.technicians = action.payload.results as ITechnician[];
      })
      .addCase(createTechnicianAction.rejected, (state, action) => {
        state.createTechnicianStatus = "failed";

        if (action.payload) {
          state.createTechnicianError = action.payload.message;
        } else state.createTechnicianError = action.error.message;
      });

    builder
      .addCase(updateTechnicianAction.pending, (state) => {
        state.updateTechnicianStatus = "loading";
      })
      .addCase(updateTechnicianAction.fulfilled, (state, action) => {
        state.updateTechnicianStatus = "completed";
        state.updateTechnicianSuccess = action.payload.message;
        state.technician = action.payload.result as ITechnician;
      })
      .addCase(updateTechnicianAction.rejected, (state, action) => {
        state.updateTechnicianStatus = "failed";

        if (action.payload) {
          state.updateTechnicianError = action.payload.message;
        } else state.updateTechnicianError = action.error.message;
      });

    builder
      .addCase(deleteTechnicianAction.pending, (state) => {
        state.deleteTechnicianStatus = "loading";
      })
      .addCase(deleteTechnicianAction.fulfilled, (state, action) => {
        state.deleteTechnicianStatus = "completed";
        state.deleteTechnicianSuccess = action.payload.message;
      })
      .addCase(deleteTechnicianAction.rejected, (state, action) => {
        state.deleteTechnicianStatus = "failed";

        if (action.payload) {
          state.deleteTechnicianError = action.payload.message;
        } else state.deleteTechnicianError = action.error.message;
      });

    builder
      .addCase(getTechnicianAction.pending, (state) => {
        state.getTechnicianStatus = "loading";
      })
      .addCase(getTechnicianAction.fulfilled, (state, action) => {
        state.getTechnicianStatus = "completed";
        state.getTechnicianSuccess = action.payload.message;
        state.technician = action.payload.result as ITechnician;
      })
      .addCase(getTechnicianAction.rejected, (state, action) => {
        state.getTechnicianStatus = "failed";

        if (action.payload) {
          state.getTechnicianError = action.payload.message;
        } else state.getTechnicianError = action.error.message;
      });

    builder
      .addCase(getTechniciansAction.pending, (state) => {
        state.getTechniciansStatus = "loading";
      })
      .addCase(getTechniciansAction.fulfilled, (state, action) => {
        state.getTechniciansStatus = "completed";
        state.getTechniciansSuccess = action.payload.message;
        state.technicians = action.payload.results as ITechnician[];
      })
      .addCase(getTechniciansAction.rejected, (state, action) => {
        state.getTechniciansStatus = "failed";

        if (action.payload) {
          state.getTechniciansError = action.payload.message;
        } else state.getTechniciansError = action.error.message;
      });
  },
});

export const {
  clearCreateTechnicianStatus,
  clearDeleteTechnicianStatus,
  clearGetTechniciansStatus,
  clearGetTechnicianStatus,
  clearUpdateTechnicianStatus,
} = technicianSlice.actions;
export default technicianSlice.reducer;
