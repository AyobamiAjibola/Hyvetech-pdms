import { Request, Response } from 'express';

import PartnerController, { ICreatePaymentPlanBody, ICreatePlanBody } from '../controllers/PartnerController';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import PasswordEncoder from '../utils/PasswordEncoder';

const passwordEncoder = new PasswordEncoder();

const partnerController = new PartnerController(passwordEncoder);

export const createPartnerHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.createPartner(req);

  res.status(result.code).json(result);
});

export const deletePartnerHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.deletePartner(req);

  res.status(result.code).json(result);
});

export const createPartnerKycHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.createKyc(req);

  res.status(result.code).json(result);
});

export const createPartnerSettingsHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.createSettings(req);

  res.status(result.code).json(result);
});

export const getPartnersHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.getPartners();

  res.status(result.code).json(result);
});

export const getPartnerHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const id = req.params.partnerId as string;

  const result = await partnerController.getPartner(+id);

  res.status(result.code).json(result);
});

export const addPlanHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const partnerId = req.params.partnerId as string;
  const body = req.body as ICreatePlanBody;

  const result = await partnerController.addPlan(body, +partnerId);

  res.status(result.code).json(result);
});

export const addPaymentPlanHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const partnerId = req.params.partnerId as string;
  const body = req.body as ICreatePaymentPlanBody;

  const result = await partnerController.addPaymentPlan(body, +partnerId);

  res.status(result.code).json(result);
});

export const getPlansHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const partnerId = req.params.partnerId as string;

  const result = await partnerController.getPlans(+partnerId);

  res.status(result.code).json(result);
});

export const getPaymentPlansHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const partnerId = req.params.partnerId as string;

  const result = await partnerController.getPaymentPlans(+partnerId);

  res.status(result.code).json(result);
});

export const filterDriversHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.filterDrivers(req);

  res.status(result.code).json(result);
});

export const driversFilterDataHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.driversFilterData(req);

  res.status(result.code).json(result);
});

export const partnerJobsHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.jobs(req);

  res.status(result.code).json(result);
});

export const deletePlanHandler = authenticateRouteWrapper(async (req: Request, res: Response) => {
  const result = await partnerController.deletePlan(req);

  res.status(result.code).json(result);
});
