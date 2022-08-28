import authEndpoints from "./auth.endpoints";
import appointmentEndpoints from "./appointment.endpoints";
import customerEndpoints from "./customer.endpoints";
import dashboardEndpoints from "./dashboard.endpoints";
import timeslotEndpoints from "./timeslot.endpoints";

const endpoints = authEndpoints
  .concat(appointmentEndpoints)
  .concat(customerEndpoints)
  .concat(dashboardEndpoints)
  .concat(timeslotEndpoints);

export default endpoints;
