import Vehicles from "../components/customer/Vehicles";
import Appointments from "../components/customer/Appointments";
import Transactions from "../components/customer/Transactions";
import Quotes from "../components/customer/Quotes";
import { ITab } from "@app-interfaces";
import Plans from "../components/partner/rideShare/Plans";
import PaymentPlans from "../components/partner/rideShare/PaymentPlans";
import RideShareDriver from "../components/partner/garage/RideShareDriver";
import { GARAGE_CATEGORY, RIDE_SHARE_CATEGORY } from "../config/constants";
import RideShareSettings from "../components/partner/rideShare/RideShareSettings";
import VehicleOwner from "../components/partner/garage/VehicleOwner";
import GarageProfileAndSetting from "../components/partner/garage/GarageProfileAndSetting";
import DriverProfile from "../components/partner/garage/DriverProfile";
import DriverVehicles from "../components/partner/garage/DriverVehicles";
import TechniciansPage from "../pages/technician/TechniciansPage";
import Estimate from "../components/partner/garage/Estimate";

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
    name: "Jiffix Hyve",
    Element: VehicleOwner,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Ride Share Hyve",
    Element: RideShareDriver,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Garage Profile & Settings",
    Element: GarageProfileAndSetting,
  },
  {
    tag: GARAGE_CATEGORY,
    name: "Technician Management",
    Element: TechniciansPage,
  },
];

export const driverSearchResultTabs: ITab[] = [
  { tag: "driver", name: "Driver Profile", Element: DriverProfile },
  { tag: "driver", name: "Vehicles", Element: DriverVehicles },
  { tag: "driver", name: "Create Estimate", Element: Estimate },
];
