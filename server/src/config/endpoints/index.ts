import authEndpoints from './auth.endpoints';
import appointmentEndpoints from './appointment.endpoints';
import customerEndpoints from './customer.endpoints';
import dashboardEndpoints from './dashboard.endpoints';
import timeslotEndpoints from './timeslot.endpoints';
import miscellaneousEndpoints from './miscellaneous.endpoints';
import partnerEndpoints from './partner.endpoints';
import rideShareEndpoints from './ride-share.endpoints';
import vehicleEndpoints from './vehicle.endpoints';
import technicianEndpoints from './technician.endpoints';
import jobEndpoints from './job.endpoints';
import userEndpoints from './user.endpoints';
import checkListEndpoints from './check-list.endpoints';
import transactionEndpoints from './transaction.endpoints';
import estimateEndpoints from './estimate.endpoints';
import invoiceEndpoints from './invoice.endpoints';
import expenseEndpoints from './expense.endpoint';
import roleEndpoints from './role.endpoint';
import itemEndpoints from './item.endpoints';

const endpoints = authEndpoints
  .concat(appointmentEndpoints)
  .concat(customerEndpoints)
  .concat(dashboardEndpoints)
  .concat(miscellaneousEndpoints)
  .concat(partnerEndpoints)
  .concat(timeslotEndpoints)
  .concat(rideShareEndpoints)
  .concat(vehicleEndpoints)
  .concat(technicianEndpoints)
  .concat(jobEndpoints)
  .concat(userEndpoints)
  .concat(checkListEndpoints)
  .concat(transactionEndpoints)
  .concat(estimateEndpoints)
  .concat(invoiceEndpoints)
  .concat(expenseEndpoints)
  .concat(roleEndpoints)
  .concat(itemEndpoints);

export default endpoints;
