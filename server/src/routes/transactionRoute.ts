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

export const initRefundCustomerHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.initRefundCustomer(req);
  res.status(response.code).json(response);
});

export const verifyRefundCustomerHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.verifyRefundCustomer(req);
  res.status(response.code).json(response);
});

export const initTransactionCallbackHandler = async (req: Request, res: Response) => {
  const response = await TransactionController.initTransactionCallback(req);

  res.status(response.code).json(response);
};

export const updateTransactionHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.updateTransaction(req);

  res.status(response.code).json(response);
});

export const getPaymentRecieveHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await TransactionController.paymentRecieve(req);

  res.status(response.code).json(response);
});