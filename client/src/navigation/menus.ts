import Vehicles from "../components/customer/Vehicles";
import Appointments from "../components/customer/Appointments";
import Transactions from "../components/customer/Transactions";
import Quotes from "../components/customer/Quotes";
import { ITab } from "@app-interfaces";

export const customerDetailTabs: ITab[] = [
  { name: "Vehicles", Element: Vehicles },
  { name: "Appointments", Element: Appointments },
  { name: "Transactions", Element: Transactions },
  { name: "Quotes", Element: Quotes },
];
