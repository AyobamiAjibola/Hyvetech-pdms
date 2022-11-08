import { appCommonTypes } from "../../@types/app-common";
import {
  getDriverHandler,
  getRideShareDriverAppointmentsHandler,
  getRideShareDriverHandler,
  getRideShareDriversHandler,
  getRideShareDriverTransactionsHandler,
  getRideShareDriverVehiclesHandler,
} from "../../routes/rideShareRoute";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const rideShareEndpoints: RouteEndpoints = [
  {
    name: "ride share driver",
    method: "get",
    path: "/ride-share/:driverId/driver",
    handler: getDriverHandler,
  },

  {
    name: "ride share drivers",
    method: "get",
    path: "/ride-share",
    handler: getRideShareDriversHandler,
  },
  {
    name: "ride share driver by id",
    method: "get",
    path: "/ride-share/:driverId",
    handler: getRideShareDriverHandler,
  },
  {
    name: "ride share driver vehicles",
    method: "get",
    path: "/ride-share/:driverId/vehicles",
    handler: getRideShareDriverVehiclesHandler,
  },
  {
    name: "ride share driver appointments",
    method: "get",
    path: "/ride-share/:driverId/appointments",
    handler: getRideShareDriverAppointmentsHandler,
  },
  {
    name: "ride share driver transactions",
    method: "get",
    path: "/ride-share/:driverId/transactions",
    handler: getRideShareDriverTransactionsHandler,
  },
];

export default rideShareEndpoints;
