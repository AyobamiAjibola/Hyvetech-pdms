import { Request, Response } from 'express';
import TransactionController from '../controllers/TransactionController';

export const txnStatusHandler = async (req: Request, res: Response) => {
  await TransactionController.subscriptionsTransactionStatus(req);
};
