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

export const getPartnersHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await partnerController.getPartners();

    res.status(result.code).json(result);
  }
);

export const getPartnerHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.partnerId as unknown as string;

    const result = await partnerController.getPartner(+id);

    res.status(result.code).json(result);
  }
);

export const addPlanHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as unknown as string;
    const body = req.body as ICreatePlanBody;

    const result = await partnerController.addPlan(body, +partnerId);

    res.status(result.code).json(result);
  }
);

export const addPaymentPlanHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as unknown as string;
    const body = req.body as ICreatePaymentPlanBody;

    const result = await partnerController.addPaymentPlan(body, +partnerId);

    res.status(result.code).json(result);
  }
);

export const getPlansHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as unknown as string;

    const result = await partnerController.getPlans(+partnerId);

    res.status(result.code).json(result);
  }
);

export const getPaymentPlansHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const partnerId = req.params.partnerId as unknown as string;

    const result = await partnerController.getPaymentPlans(+partnerId);

    res.status(result.code).json(result);
  }
);
