import {IThunkAPIStatus} from "@app-types";
import {createSlice} from "@reduxjs/toolkit";
import {createPartnerAction, getPartnerAction, getPartnersAction} from "../actions/partnerActions";
import {IPartner} from "@app-models";

interface IPartnerState {
    createPartnerStatus: IThunkAPIStatus;
    createPartnerSuccess: string;
    createPartnerError?: string;

    getPartnersStatus: IThunkAPIStatus;
    getPartnersSuccess: string;
    getPartnersError?: string;

    getPartnerStatus: IThunkAPIStatus;
    getPartnerSuccess: string;
    getPartnerError?: string;

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

    getPartnerError: "",
    getPartnerStatus: "idle",
    getPartnerSuccess: "",

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
        clearGetPartnerStatus(state: IPartnerState) {
            state.getPartnerStatus = "idle";
            state.getPartnerSuccess = "";
            state.getPartnerError = "";
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
            .addCase(getPartnerAction.pending, state => {
                state.getPartnerStatus = "idle"
            })
            .addCase(getPartnerAction.fulfilled, (state, action) => {
                state.getPartnerStatus = "completed"
                state.partner = action.payload.result as IPartner
            })
            .addCase(getPartnerAction.rejected, (state, action) => {
                state.getPartnerStatus = "failed"
                if (action.payload) {
                    state.getPartnerError = action.payload.message;
                } else state.getPartnerError = action.error.message;
            })
    },
});

export const {clearCreatePartnerStatus, clearGetPartnersStatus, clearGetPartnerStatus} =
    partnerSlice.actions;

export default partnerSlice.reducer;
