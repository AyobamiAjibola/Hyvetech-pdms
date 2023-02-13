import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import CustomerController from '../controllers/CustomerController';

export const getCustomersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.allCustomers();
  res.status(response.code).json(response);
});

export const getNewCustomersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.allNewCustomers(req);
  res.status(response.code).json(response);
});

export const addCustomersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.addCustomers(req);
  res.status(response.code).json(response);
});

export const importCustomersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.importCustomers(req);
  res.status(response.code).json(response);
});

export const updateCustomersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.updateCustomers(req);
  res.status(response.code).json(response);
});

export const getCustomerHandler = authenticateRouteWrapper(async (req, res) => {
  const customerId = req.params.customerId as string;

  const response = await CustomerController.customer(+customerId);
  res.status(response.code).json(response);
});

export const getCustomerVehiclesHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.customerVehicles(req);
  res.status(response.code).json(response);
});

export const getCustomerAppointmentsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.customerAppointments(req);
  res.status(response.code).json(response);
});

export const getCustomerTransactionsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.customerTransactions(req);
  res.status(response.code).json(response);
});

export const suggestWorkshopHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CustomerController.suggestWorkshop(req);
  res.status(response.code).json(response);
});
