import React, { createContext, useState } from "react";

import { AppContextProperties } from "@app-interfaces";
import App from "../App";
import AbilityContext, { ability } from "./AbilityContext";

export const AppContext = createContext<AppContextProperties | null>(null);

function AppContextProvider() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [showBooking, setShowBooking] = useState<boolean>(false);
  const [showBookingBtn, setShowBookingBtn] = useState<boolean>(false);
  const [checkedSlot, setCheckedSlot] = useState<boolean>(false);
  const [planTab, setPlanTab] = useState<number>(0);
  const [mobileDate, setMobileDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);

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
      }}
    >
      <AbilityContext.Provider value={ability}>
        <App />
      </AbilityContext.Provider>
    </AppContext.Provider>
  );
}

export default AppContextProvider;
