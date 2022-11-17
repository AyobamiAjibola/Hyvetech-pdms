import { getVehicleSubscriptions, getVehicleVIN } from "../../routes/vehicleRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const vehicleEndpoints: RouteEndpoints = [
  {
    name: "vehicle subscriptions",
    method: "get",
    path: "/vehicle/:vehicleId/customer-subs",
    handler: getVehicleSubscriptions,
  },
  {
    name: "vehicle subscriptions",
    method: "get",
    path: "/vehicle/:vehicleId/driver-subs",
    handler: getVehicleSubscriptions,
  },
  {
    name: "vehicle VIN",
    method: "get",
    path: "/vehicle",
    handler: getVehicleVIN,
  },
];

export default vehicleEndpoints;
