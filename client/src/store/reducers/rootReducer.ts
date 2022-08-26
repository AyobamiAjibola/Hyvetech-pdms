import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from "./authenticationReducer";
import dashboardReducer from "./dashboardReducer";
import customerReducer from "./customerReducer";
import appointmentReducer from "./appointmentReducer";

const rootReducer = combineReducers({
  appointmentReducer,
  authenticationReducer,
  customerReducer,
  dashboardReducer,
});

export default rootReducer;
