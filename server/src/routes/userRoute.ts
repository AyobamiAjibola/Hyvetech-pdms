import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import UserController from "../controllers/UserController";

export const getUserHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await UserController.user(req);

  res.status(response.code).json(response);
});

export const getUsersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await UserController.users();

  res.status(response.code).json(response);
});
