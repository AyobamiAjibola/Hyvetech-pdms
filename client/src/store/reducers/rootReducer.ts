import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './authenticationReducer';
import dashboardReducer from './dashboardReducer';
import customerReducer from './customerReducer';
import appointmentReducer from './appointmentReducer';
import timeSlotReducer from './timeSlotReducer';
import miscellaneousReducer from './miscellaneousReducer';
import partnerReducer from './partnerReducer';
import rideShareReducer from './rideShareReducer';
import vehicleReducer from './vehicleReducer';
import technicianReducer from './technicianReducer';
import jobReducer from './jobReducer';
import userReducer from './userReducer';
import checkListReducer from './checkListReducer';
import estimateReducer from './estimateReducer';
import invoiceReducer from './invoiceReducer';
import transactionReducer from './transactionReducer';
import expenseReducer from './expenseReducer';
import itemStockReducer from './itemStockReducer';
import serviceReminderReducer from './serviceReminderReducer';
import autoHyveReducer from './autoHyveReducer';

const rootReducer = combineReducers({
  appointmentReducer,
  authenticationReducer,
  customerReducer,
  dashboardReducer,
  timeSlotReducer,
  miscellaneousReducer,
  partnerReducer,
  rideShareReducer,
  vehicleReducer,
  technicianReducer,
  jobReducer,
  userReducer,
  checkListReducer,
  estimateReducer,
  invoiceReducer,
  transactionReducer,
  expenseReducer,
  itemStockReducer,
  serviceReminderReducer,
  autoHyveReducer,
});

export default rootReducer;
