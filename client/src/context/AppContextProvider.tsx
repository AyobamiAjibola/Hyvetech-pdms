import React, { createContext, useState } from "react";

import { AppContextProperties } from "@app-interfaces";
import App from "../App";
import AbilityContext, { ability } from "./AbilityContext";

export const AppContext = createContext<AppContextProperties | null>(null);

function AppContextProvider() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
      }}
    >
      <AbilityContext.Provider value={ability}>
        <App />
      </AbilityContext.Provider>
    </AppContext.Provider>
  );
}

export default AppContextProvider;
