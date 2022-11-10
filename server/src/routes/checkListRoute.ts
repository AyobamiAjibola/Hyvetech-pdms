import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import CheckListController from "../controllers/CheckListController";

export const createCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.create(req);
  res.status(response.code).json(response);
});

export const updateCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.update(req);
  res.status(response.code).json(response);
});

export const deleteCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.delete(req);
  res.status(response.code).json(response);
});

export const createJobCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.createJobCheckList(req);
  res.status(response.code).json(response);
});

export const updateJobCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.updateJobCheckList(req);
  res.status(response.code).json(response);
});

export const getCheckListsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.checkLists();
  res.status(response.code).json(response);
});

export const getCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await CheckListController.checkList(req);
  res.status(response.code).json(response);
});
