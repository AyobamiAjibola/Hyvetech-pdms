import React, { createContext, useState } from "react";

import { AppContextProps } from "@app-interfaces";
import App from "../App";
import AbilityContext, { ability } from "./AbilityContext";
import { ICustomer, IVehicle } from "@app-models";

export const AppContext = createContext<AppContextProps | null>(null);

function AppContextProvider() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const [showBookingBtn, setShowBookingBtn] = useState<boolean>(false);
  const [checkedSlot, setCheckedSlot] = useState<boolean>(false);
  const [planTab, setPlanTab] = useState<number>(0);
  const [mobileDate, setMobileDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [showVehicles, setShowVehicles] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      <AbilityContext.Provider value={ability}>
        <App />
      </AbilityContext.Provider>
    </AppContext.Provider>
  );
}

export default AppContextProvider;
