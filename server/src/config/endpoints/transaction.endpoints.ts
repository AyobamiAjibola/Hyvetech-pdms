import { txnStatusHandler } from "../../routes/transactionRoute";
import { appCommonTypes } from "../../@types/app-common";
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const transactionEndpoints: RouteEndpoints = [
  {
    name: "transactions",
    method: "get",
    path: "/transactions",
    handler: txnStatusHandler,
  },
];

export default transactionEndpoints;
