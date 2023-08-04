import { Request, Response } from "express";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import CBAController from "../controllers/CBAController";
import dao from "../services/dao";

const cbaController = new CBAController(dao.kudaService);

export const createAccountHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.createAccount(req);

    res.status(result.code).json(result);
  }
);

export const getAccountBalance = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.getAccountBalance(req);

    res.status(result.code).json(result);
  }
);

export const getAccountTransactions = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.getAccountTransactions(req);

    res.status(result.code).json(result);
  }
);

export const performNameEnquiry = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.performNameEnquiry(req);

    res.status(result.code).json(result);
  }
);

/**
 * @swagger
 *  /api/v1/account/request/activation:
 *  post:
 *   description: Create virtual account
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/CreateVirtualAccount'
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/CreateVirtualAccount'
 *    400:
 *     description: Bad requests
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/definitions/ErrorResponse'
 *    401:
 *     description: Unauthorized
 *     content:
 *       application/json:
 *        schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

export const performAccountActivationRequest = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.performAccountActivationRequest(req);

    res.status(result.code).json(result);
  }
);

export const performAccountActivation = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.performAccountActivation(req);

    res.status(result.code).json(result);
  }
);

export const performAccountActivationRejection = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.performAccountActivationRejection(req);

    res.status(result.code).json(result);
  }
);

export const initiateAccountTransfer = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.initiateAccountTranfer(req);

    res.status(result.code).json(result);
  }
);

export const createBeneficiary = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.createBeneficiary(req);

    res.status(result.code).json(result);
  }
);

export const getKycAccountRequest = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.getKyRequests(req);

    res.status(result.code).json(result);
  }
);

export const performAccountPinUpdate = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.updateAccountPin(req);

    res.status(result.code).json(result);
  }
);

export const performAccountUpdate = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.updateAccount(req);

    res.status(result.code).json(result);
  }
);

export const getMainAccountTransactions = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await cbaController.getMainAccountTransactions(req);

    res.status(result.code).json(result);
  }
);

export const getAccountDetail = async (req: Request, res: Response) => {
  const result = await cbaController.getAccountDetail(req);

  res.status(result.code).json(result);
};
