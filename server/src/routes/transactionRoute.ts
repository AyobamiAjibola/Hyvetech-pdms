import { Request, Response } from 'express';
import TransactionController from '../controllers/TransactionController';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';

export const txnStatusHandler = async (req: Request, res: Response) => {
  await TransactionController.subscriptionsTransactionStatus(req);
};

export const depositForEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.depositForEstimate(req);
  res.status(response.code).json(response);
});

export const initTransactionCallbackHandler = async (req: Request, res: Response) => {
  const response = await TransactionController.initTransactionCallback(req);

  res.status(response.code).json(response);
};

export const generateInvoiceHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.generateInvoice(req);

  res.status(response.code).json(response);
});
