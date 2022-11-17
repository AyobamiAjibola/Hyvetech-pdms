import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import EstimateController from "../controllers/EstimateController";

const estimateController = new EstimateController();

export const createEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.create(req);
  res.status(response.code).json(response);
});

export const getEstimatesHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.estimates(req);
  res.status(response.code).json(response);
});
