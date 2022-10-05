export const LOCAL_STORAGE = {
  bookingData: "_booking_data",
  isOneTime: "_is_one_time",
  profileComplete: "_profile_complete",
  referenceNumber: "_reference_number",
  payCancelled: "_pay_cancelled",
  timeSlot: "_time_slot",
  permissions: "_permissions",
};
export const PASSWORD_PATTERN =
  "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&+=])(?=\\S+$).{8,20}$";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MESSAGES = {
  txn_init: "Authorization URL created",
  cancelText: `Are you sure you want to carry out this action? 
  If you agree to do this, the affected entity, will not be able to execute certain features on the app.`,
  internalError: "An error occurred. Please contact support",
};

export const MOBILE_PLAN = "Mobile";
export const DRIVE_IN_PLAN = "Drive-in";
export const HYBRID_PLAN = "Hybrid";

export const MAIN_OFFICE = "No. 10, 45 Road, off 1st Avenue Gwarimpa";
export const INVENTORY = "Inventory";
export const REPORT = "Report";
export const ESTIMATE = "Estimate";

export const APPOINTMENT_STATUS = {
  pending: "Pending",
  complete: "Complete",
  inProgress: "In-Progress",
  reject: "Rejected",
  cancel: "Cancelled",
};

export const BOOK_APPOINTMENT = "event:BOOK_APPOINTMENT";
export const RESCHEDULE_APPOINTMENT = "event:RESCHEDULE_APPOINTMENT";
export const CANCEL_APPOINTMENT = "event:CANCEL_APPOINTMENT";
export const AGENDA_COLLECTION_NAME = "appointmentJobs";

export const ONE_TIME_SUB = "One Time";
export const HOUSE_HOLD_SUB = "House Hold";
export const FAF_SUB = "Family & Friends";
export const PICK_ME_UP_SUB = "Pick Me Up";

export const MOBILE_CATEGORY = "Mobile";
export const DRIVE_IN_CATEGORY = "Drive-in";
export const HYBRID_CATEGORY = "Hybrid";
export const GARAGE_CATEGORY = "Garage";
export const RIDE_SHARE_CATEGORY = "Ride-Share";

export const JOB_STATUS = {
  complete: "Complete",
  pending: "Pending",
  inProgress: "In-Progress",
  canceled: "Canceled",
};
export const DRAWER_WIDTH = 240;
export const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
