import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import VehicleController from "../controllers/VehicleController";

export const getVehicleSubscriptions = authenticateRouteWrapper(
  async (req, res) => {
    const response = await VehicleController.vehicleSubscriptions(req);

    res.status(response.code).json(response);
  }
);
