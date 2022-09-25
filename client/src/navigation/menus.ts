import Vehicles from "../components/customer/Vehicles";
import Appointments from "../components/customer/Appointments";
import Transactions from "../components/customer/Transactions";
import Quotes from "../components/customer/Quotes";
import { ITab } from "@app-interfaces";
import Plans from "../components/partner/rideShare/Plans";
import PaymentPlans from "../components/partner/rideShare/PaymentPlans";
import Drivers from "../components/partner/garage/Drivers";
import DriverVehicles from "../components/partner/garage/DriverVehicles";
import { GARAGE_CATEGORY, RIDE_SHARE_CATEGORY } from "../config/constants";
import RideShareSettings from "../components/partner/rideShare/RideShareSettings";
import GarageSettings from "../components/partner/garage/GarageSettings";

export const customerDetailTabs: ITab[] = [
  { name: "Vehicles", Element: Vehicles },
  { name: "Appointments", Element: Appointments },
  { name: "Transactions", Element: Transactions },
  { name: "Quotes", Element: Quotes },
];

export const partnerDetailTabs: ITab[] = [
  { tag: RIDE_SHARE_CATEGORY, name: "Plans", Element: Plans },
  {
    tag: RIDE_SHARE_CATEGORY,
    name: "Payment Plans",
    Element: PaymentPlans,
  },
  {
    tag: RIDE_SHARE_CATEGORY,
    name: "Settings",
    Element: RideShareSettings,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Drivers",
    Element: Drivers,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Vehicles",
    Element: DriverVehicles,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Settings",
    Element: GarageSettings,
  },
];
