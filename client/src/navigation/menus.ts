import { ITab } from '@app-interfaces';

import CustomerAppointments from '../components/customer/Appointments';
import CustomerQuotes from '../components/customer/Quotes';
import CustomerTransactions from '../components/customer/Transactions';
import CustomerVehicles from '../components/customer/Vehicles';
import DriverQuotes from '../components/driver/Quotes';
import DriverTransactions from '../components/driver/Transactions';
import DriverVehicles from '../components/driver/Vehicles';
import GarageDriverProfile from '../components/partner/garage/DriverProfile';
import DriverProfile from '../components/driver/Profile';
import GarageVehicles from '../components/partner/garage/DriverVehicles';
import OwnerVehicles from '../components/partner/garage/CustomerVehicles';
import GarageProfileAndSetting from '../components/partner/garage/GarageProfileAndSetting';
// import RideShareDriver from '../components/partner/garage/RideShareDriver';
import PaymentPlans from '../components/partner/rideShare/PaymentPlans';
import Plans from '../components/partner/rideShare/Plans';
import RideShareSettings from '../components/partner/rideShare/RideShareSettings';
import { GARAGE_CATEGORY, RIDE_SHARE_CATEGORY } from '../config/constants';
// import TechniciansPage from '../pages/technician/TechniciansPage';
import Estimate from '../components/partner/garage/Estimate';
// import VehicleOwner from '../components/partner/garage/VehicleOwner';
import ProfileNew from '../components/customer/Profile';
import UserRoleManagement from '../components/partner/garage/UserRoleManagement';

export const customerDetailTabsTechOnly: ITab[] = [
  { name: 'Profile', Element: ProfileNew },
  { name: 'Vehicles', Element: CustomerVehicles },
];

export const customerDetailTabs: ITab[] = [
  { name: 'Vehicles', Element: CustomerVehicles },
  { name: 'Appointments', Element: CustomerAppointments },
  { name: 'Transactions', Element: CustomerTransactions },
  { name: 'Quotes', Element: CustomerQuotes },
];

export const driverDetailTabs: ITab[] = [
  { name: 'Profile', Element: DriverProfile },
  { name: 'Vehicles', Element: DriverVehicles },
  { name: 'Transactions', Element: DriverTransactions },
  { name: 'Estimates', Element: DriverQuotes },
];

export const partnerDetailTabs: ITab[] = [
  { tag: RIDE_SHARE_CATEGORY, name: 'Plans', Element: Plans },
  {
    tag: RIDE_SHARE_CATEGORY,
    name: 'Payment Plans',
    Element: PaymentPlans,
  },
  {
    tag: RIDE_SHARE_CATEGORY,
    name: 'Settings',
    Element: RideShareSettings,
  },
  // {
  //   tag: GARAGE_CATEGORY,
  //   name: 'Auto Hyve',
  //   Element: VehicleOwner,
  // },
  // {
  //   tag: GARAGE_CATEGORY,
  //   name: 'Ride Share Hyve',
  //   Element: RideShareDriver,
  // },
  {
    tag: GARAGE_CATEGORY,
    name: 'Account Settings',
    Element: GarageProfileAndSetting,
  },
  {
    tag: GARAGE_CATEGORY,
    name: 'User & Role Management',
    Element: UserRoleManagement,
  },
  // {
  //   tag: GARAGE_CATEGORY,
  //   name: 'Technician Management',
  //   Element: TechniciansPage,
  // },
];

export const driverSearchResultTabs: ITab[] = [
  { tag: 'driver', name: 'Customer Profile', Element: GarageDriverProfile },
  { tag: 'driver', name: 'Vehicles', Element: GarageVehicles },
];

export const customerSearchResultTabs: ITab[] = [
  { tag: 'profile', name: 'Customer Profile', Element: GarageDriverProfile },
  { tag: 'vehicles', name: 'Vehicles', Element: OwnerVehicles },
  { tag: 'estimate', name: 'Create Estimate', Element: Estimate },
];
