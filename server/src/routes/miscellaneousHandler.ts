import { Request, Response } from "express";

import MiscellaneousController from "../controllers/MiscellaneousController";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";

export const statesAndDistrictsHandler = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await MiscellaneousController.getStatesAndDistricts();

    res.status(result.code).json(result);
  }
);
