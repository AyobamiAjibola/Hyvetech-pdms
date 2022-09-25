import authEndpoints from "./auth.endpoints";
import appointmentEndpoints from "./appointment.endpoints";
import customerEndpoints from "./customer.endpoints";
import dashboardEndpoints from "./dashboard.endpoints";
import timeslotEndpoints from "./timeslot.endpoints";
import miscellaneousEndpoints from "./miscellaneous.endpoints";
import partnerEndpoints from "./partner.endpoints";
import rideShareEndpoints from "./ride-share.endpoints";

const endpoints = authEndpoints
  .concat(appointmentEndpoints)
  .concat(customerEndpoints)
  .concat(dashboardEndpoints)
  .concat(miscellaneousEndpoints)
  .concat(partnerEndpoints)
  .concat(timeslotEndpoints)
  .concat(rideShareEndpoints);

export default endpoints;
