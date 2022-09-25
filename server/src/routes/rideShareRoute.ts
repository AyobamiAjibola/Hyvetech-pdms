import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import RideShareController from "../controllers/RideShareController";

const rideShareController = new RideShareController();

export const getDriverHandler = authenticateRouteWrapper(async (req, res) => {
  const driverId = req.params.driverId as string;

  const response = await rideShareController.driver(+driverId);

  res.status(response.code).json(response);
});
