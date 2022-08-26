import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import reportWebVitals from "./reportWebVitals";
import store from "./store";
import AppContextProvider from "./context/AppContextProvider";
import AppLoader from "./components/loader/AppLoader";

import "./index.css";

const appRoot = createRoot(document.getElementById("root") as HTMLElement);

appRoot.render(
  <React.StrictMode>
    <Provider store={store}>
      <React.Suspense fallback={<AppLoader show={true} />}>
        <AppContextProvider />
      </React.Suspense>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
