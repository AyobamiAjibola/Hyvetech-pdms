import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import RideShareController from "../controllers/RideShareController";
import RideShareDriverController from "../controllers/RideShareDriverController";

const rideShareController = new RideShareController();

export const getDriverHandler = authenticateRouteWrapper(async (req, res) => {
  const driverId = req.params.driverId as string;

  const response = await rideShareController.driver(+driverId);

  res.status(response.code).json(response);
});

export const getRideShareDriversHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await RideShareDriverController.allRideShareDrivers();
    res.status(response.code).json(response);
  }
);

export const getRideShareDriverHandler = authenticateRouteWrapper(
  async (req, res) => {
    const driverId = req.params.driverId as string;

    const response = await RideShareDriverController.driver(+driverId);
    res.status(response.code).json(response);
  }
);

export const getRideShareDriverVehiclesHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await RideShareDriverController.driverVehicles(req);
    res.status(response.code).json(response);
  }
);

export const getRideShareDriverAppointmentsHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await RideShareDriverController.driverAppointments(req);
    res.status(response.code).json(response);
  }
);

export const getRideShareDriverTransactionsHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await RideShareDriverController.driverTransactions(req);
    res.status(response.code).json(response);
  }
);
