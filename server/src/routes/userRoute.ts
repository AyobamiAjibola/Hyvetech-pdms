import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import UserController from '../controllers/UserController';
import PasswordEncoder from '../utils/PasswordEncoder';

const passwordEncoder = new PasswordEncoder();
const userController = new UserController(passwordEncoder);

export const getUserHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await userController.user(req);

  res.status(response.code).json(response);
});

export const getUsersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await userController.users(req);

  res.status(response.code).json(response);
});

export const createUserHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await userController.createUser(req);

  res.status(response.code).json(response);
});

export const updateUsersHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await userController.updateUser(req);

  res.status(response.code).json(response);
});

export const deleteUserHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await userController.deleteUser(req);

  res.status(response.code).json(response);
});
