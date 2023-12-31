import { Request, Response } from "express";

import PartnerController, {
  ICreatePaymentPlanBody,
  ICreatePlanBody,
} from "../controllers/PartnerController";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import PasswordEncoder from "../utils/PasswordEncoder";

const passwordEncoder = new PasswordEncoder();

const partnerController = new PartnerController(passwordEncoder);

export const createPartnerHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.createPartner(req);

    res.status(result.code).json(result);
  }
);

export const deletePartnerHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.deletePartner(req);

    res.status(result.code).json(result);
  }
);

export const togglePartnerHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.togglePartner(req);

    res.status(result.code).json(result);
  }
);

export const createPartnerKycHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.createKyc(req);

    res.status(result.code).json(result);
  }
);

export const updatePartnerProfileHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.updatePartnerProfileHandler(req);

    res.status(result.code).json(result);
  }
);

export const updatePartnerSecondaryBankHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.updateSecondaryAccount(req);

    res.status(result.code).json(result);
  }
);

export const createPartnerSettingsHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.createSettings(req);

    res.status(result.code).json(result);
  }
);

export const partnerLogoUploadHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.uploadCompanyLogo(req);

    res.status(result.code).json(result);
  }
);

export const getPartnersHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.getPartners(req);

    res.status(result.code).json(result);
  }
);

export const getPartnerHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.partnerId as string;

    const result = await partnerController.getPartner(req);

    res.status(result.code).json(result);
  }
);

export const addPlanHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as string;
    const body = req.body as ICreatePlanBody;

    const result = await partnerController.addPlan(body, +partnerId);

    res.status(result.code).json(result);
  }
);

export const addPaymentPlanHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as string;
    const body = req.body as ICreatePaymentPlanBody;

    const result = await partnerController.addPaymentPlan(body, +partnerId);

    res.status(result.code).json(result);
  }
);

export const getPlansHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as string;

    const result = await partnerController.getPlans(+partnerId);

    res.status(result.code).json(result);
  }
);

export const getPaymentPlansHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as string;

    const result = await partnerController.getPaymentPlans(+partnerId);

    res.status(result.code).json(result);
  }
);

export const filterDriversHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.filterDrivers(req);

    res.status(result.code).json(result);
  }
);

export const driversFilterDataHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.driversFilterData(req);

    res.status(result.code).json(result);
  }
);

export const partnerJobsHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.jobs(req);

    res.status(result.code).json(result);
  }
);

export const deletePlanHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.deletePlan(req);

    res.status(result.code).json(result);
  }
);

export const requestPdfHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.requestPdf(req);

    // @ts-ignore
    res.status(result.code).json(result);
  }
);

export const updatePreferencesHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.updatePreferences(req);

    // @ts-ignore
    res.status(result.code).json(result);
  }
);

export const getPreferencesHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.getPreferences(req);

    // @ts-ignore
    res.status(result.code).json(result);
  }
);

export const getPartnerAccountHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.getPartnerAccount(req);

    res.status(result.code).json(result);
  }
);

export const upVoteHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.upVote(req);

    res.status(result.code).json(result);
  }
);
