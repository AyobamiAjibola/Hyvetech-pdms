import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import CheckListController from "../controllers/CheckListController";

export const createCheckListHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await CheckListController.create(req);
    res.status(response.code).json(response);
  }
);
