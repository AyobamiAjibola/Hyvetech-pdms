import {
  getCustomerAppointmentsHandler,
  getCustomerHandler,
  getCustomersHandler,
  getCustomerTransactionsHandler,
  getCustomerVehiclesHandler,
  suggestWorkshopHandler,
} from '../../routes/customerRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const customerEndpoints: RouteEndpoints = [
  {
    name: 'customer',
    method: 'get',
    path: '/customers',
    handler: getCustomersHandler,
  },
  {
    name: 'customer',
    method: 'get',
    path: '/customer/:customerId',
    handler: getCustomerHandler,
  },
  {
    name: 'customer',
    method: 'get',
    path: '/customers/:customerId/vehicles',
    handler: getCustomerVehiclesHandler,
  },
  {
    name: 'customer',
    method: 'get',
    path: '/customers/:customerId/appointments',
    handler: getCustomerAppointmentsHandler,
  },
  {
    name: 'customer',
    method: 'get',
    path: '/customers/:customerId/transactions',
    handler: getCustomerTransactionsHandler,
  },

  {
    name: 'suggest workshop',
    method: 'post',
    path: '/customers/:customerId/workshops',
    handler: suggestWorkshopHandler,
  },
];

export default customerEndpoints;
