import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Dexie from "dexie";

import reportWebVitals from "./reportWebVitals";
import store from "./store";
import AppLoader from "./components/loader/AppLoader";

import "./index.css";
import getIndexDB from "./db";
import App from "./App";

const appRoot = createRoot(document.getElementById("root") as HTMLElement);

Dexie.exists("BookingDB")
  .then((value) => {
    if (!value) return getIndexDB();
  })
  .then(() =>
    appRoot.render(
      <React.StrictMode>
        <Provider store={store}>
          <React.Suspense fallback={<AppLoader show={true} />}>
            <App />
          </React.Suspense>
        </Provider>
      </React.StrictMode>
    )
  );

reportWebVitals();
