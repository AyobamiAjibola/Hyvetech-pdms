import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import InvoiceController from '../controllers/InvoiceController';

export const completeEstimateDepositHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.completeEstimateDeposit(req);
  res.status(response.code).json(response);
});

export const generateInvoiceHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.generateInvoice(req);

  res.status(response.code).json(response);
});

export const generateInvoiceManuallyHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.generateInvoiceManually(req);

  res.status(response.code).json(response);
});

export const updateCompletedInvoicePaymentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.updateCompletedInvoicePayment(req);

  res.status(response.code).json(response);
});

export const updateCompletedInvoicePaymentManuallyHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.updateCompletedInvoicePaymentManually(req);

  res.status(response.code).json(response);
});

export const getInvoicesHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.invoices(req);

  res.status(response.code).json(response);
});

export const saveInvoiceHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.saveInvoice(req);

  res.status(response.code).json(response);
});

export const sendInvoiceHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.sendInvoice(req);

  res.status(response.code).json(response);
});

export const getSingleInvoiceHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.getSingleInvoice(req);

  res.status(response.code).json(response);
});
