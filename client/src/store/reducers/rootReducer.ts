import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from "./authenticationReducer";
import dashboardReducer from "./dashboardReducer";
import customerReducer from "./customerReducer";
import appointmentReducer from "./appointmentReducer";
import timeSlotReducer from "./timeSlotReducer";
import miscellaneousReducer from "./miscellaneousReducer";
import partnerReducer from "./partnerReducer";

const rootReducer = combineReducers({
  appointmentReducer,
  authenticationReducer,
  customerReducer,
  dashboardReducer,
  timeSlotReducer,
  miscellaneousReducer,
  partnerReducer,
});

export default rootReducer;