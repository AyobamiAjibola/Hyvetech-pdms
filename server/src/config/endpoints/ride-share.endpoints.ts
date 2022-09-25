import { appCommonTypes } from "../../@types/app-common";
import { getDriverHandler } from "../../routes/rideShareRoute";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const rideShareEndpoints: RouteEndpoints = [
  {
    name: "ride share",
    method: "get",
    path: "/ride-share/:driverId/driver",
    handler: getDriverHandler,
  },
];

export default rideShareEndpoints;
