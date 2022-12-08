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

export const updateCompletedInvoicePaymentHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.updateCompletedInvoicePayment(req);

  res.status(response.code).json(response);
});

export const getInvoicesHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await InvoiceController.invoices(req);

  res.status(response.code).json(response);
});
