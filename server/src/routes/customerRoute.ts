import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import CustomerController from "../controllers/CustomerController";

export const getCustomersHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await CustomerController.allCustomers();
    res.status(response.code).json(response);
  }
);

export const getCustomerVehiclesHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await CustomerController.customerVehicles(req);
    res.status(response.code).json(response);
  }
);

export const getCustomerAppointmentsHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await CustomerController.customerAppointments(req);
    res.status(response.code).json(response);
  }
);

export const getCustomerTransactionsHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await CustomerController.customerTransactions(req);
    res.status(response.code).json(response);
  }
);
