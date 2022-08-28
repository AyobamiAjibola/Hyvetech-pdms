import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import { Request, Response } from "express";
import TimeSlotController from "../controllers/TimeSlotController";

export const handleInitTimeslots = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await TimeSlotController.initTimeSlot(req);
    res.status(result.code).json(result);
  }
);

export const handleDisableTimeslots = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await TimeSlotController.disableTimeslot(req);
    res.status(result.code).json(result);
  }
);

export const handleGetTimeslots = authenticateRouteWrapper(
  async (req: Request, res: Response) => {
    const result = await TimeSlotController.getDefaultTimeslots();
    res.status(result.code).json(result);
  }
);
