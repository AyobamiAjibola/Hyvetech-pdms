import { Request, Response } from 'express';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import CBAController from '../controllers/CBAController';
import dao from '../services/dao';

const cbaController = new CBAController(dao.kudaService);

export const createAccountHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.createAccount(req);

  res.status(result.code).json(result);
});

export const getAccountBalance = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.getAccountBalance(req);

  res.status(result.code).json(result);
});

export const getAccountTransactions = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.getAccountTransactions(req);

  res.status(result.code).json(result);
});

export const performNameEnquiry = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.performNameEnquiry(req);

  res.status(result.code).json(result);
});

export const performAccountActivationRequest = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.performAccountActivationRequest(req);

  res.status(result.code).json(result);
});

export const performAccountActivation = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.performAccountActivation(req);

  res.status(result.code).json(result);
});

export const initiateAccountTransfer = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.initiateAccountTranfer(req);

  res.status(result.code).json(result);
});

export const getKycAccountRequest = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.getKyRequests(req);

  res.status(result.code).json(result);
});

export const performAccountUpdate = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await cbaController.updateAccount(req);

  res.status(result.code).json(result);
});
