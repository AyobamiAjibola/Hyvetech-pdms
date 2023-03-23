import RoleController from '../controllers/RoleController';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';

const roleController = new RoleController();

export const createRole = authenticateRouteWrapper(async (req, res) => {
  const response = await roleController.createRole(req);
  res.status(response.code).json(response);
});

export const getAllRole = authenticateRouteWrapper(async (req, res) => {
  const response = await roleController.getRoleAndPermission(req);
  res.status(response.code).json(response);
});

export const getAllPermissions = authenticateRouteWrapper(async (req, res) => {
  const response = await roleController.getAllPermissions(req);
  res.status(response.code).json(response);
});

export const getSingleRole = authenticateRouteWrapper(async (req, res) => {
  const response = await roleController.getRole(req);
  res.status(response.code).json(response);
});

export const updateRole = authenticateRouteWrapper(async (req, res) => {
  const response = await roleController.updateRole(req);
  res.status(response.code).json(response);
});
