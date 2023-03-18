import { Request, Response } from 'express';
import DashboardController from '../controllers/DashboardController';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';

export const dashboardHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await DashboardController.getData();
  res.status(result.code).json(result);
});

export const dashboardTechHandler = authenticateRouteWrapper(async (req, res) => {
  const result = await DashboardController.getTechData(req);
  res.status(result.code).json(result);
});
