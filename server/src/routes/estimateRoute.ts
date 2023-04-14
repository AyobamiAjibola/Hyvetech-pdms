import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import EstimateController from '../controllers/EstimateController';

const estimateController = new EstimateController();

export const createEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.create(req);
  res.status(response.code).json(response);
});

export const deleteEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.delete(req);
  res.status(response.code).json(response);
});

export const saveEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.save(req);
  res.status(response.code).json(response);
});

export const updateEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.update(req);
  res.status(response.code).json(response);
});

export const updateEstimateCountHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.updateCount(req);
  res.status(response.code).json(response);
});

export const sendDraftEstimateHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.sendDraft(req);
  res.status(response.code).json(response);
});

export const getEstimatesHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await estimateController.estimates(req);
  res.status(response.code).json(response);
});
