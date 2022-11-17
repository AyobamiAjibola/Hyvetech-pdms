import React, { createContext, useState } from 'react';

import { AppContextProps } from '@app-interfaces';
import AbilityContext, { ability } from './AbilityContext';
import { ICustomer, IRideShareDriver, IVehicle } from '@app-models';
import PrivateLayout from '../components/layouts/PrivateLayout';

export const AppContext = createContext<AppContextProps | null>(null);

export default function AppContextProvider() {
  const [openSideNav, setOpenSideNav] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const [showBookingBtn, setShowBookingBtn] = useState<boolean>(false);
  const [checkedSlot, setCheckedSlot] = useState<boolean>(false);
  const [planTab, setPlanTab] = useState<number>(0);
  const [mobileDate, setMobileDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [driver, setDriver] = useState<IRideShareDriver | null>(null);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [showVehicles, setShowVehicles] = useState<boolean>(false);

  return (
    <AbilityContext.Provider value={ability}>
      <AppContext.Provider
        value={{
          openSideNav,
          setOpenSideNav,
          isSignedIn,
          setIsSignedIn,
          showBooking,
          setShowBooking,
          showBookingBtn,
          setShowBookingBtn,
          checkedSlot,
          setCheckedSlot,
          planTab,
          setPlanTab,
          mobileDate,
          setMobileDate,
          showTime,
          setShowTime,
          customer,
          setCustomer,
          vehicle,
          setVehicle,
          vehicles,
          setVehicles,
          showVehicles,
          setShowVehicles,
          driver,
          setDriver,
        }}>
        <PrivateLayout />
      </AppContext.Provider>
    </AbilityContext.Provider>
  );
}
