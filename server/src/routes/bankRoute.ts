import { Request, Response } from 'express';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import BankController from '../controllers/BankController';
import dao from '../services/dao';

const bankController = new BankController(dao.cbaService);

export const getBankHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await bankController.getBanks(req);

  res.status(result.code).json(result);
});
