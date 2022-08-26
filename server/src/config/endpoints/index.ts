import authEndpoints from "./auth.endpoints";
import appointmentEndpoints from "./appointment.endpoints";
import customerEndpoints from "./customer.endpoints";
import dashboardEndpoints from "./dashboard.endpoints";

const endpoints = authEndpoints
  .concat(appointmentEndpoints)
  .concat(customerEndpoints)
  .concat(dashboardEndpoints);

export default endpoints;
