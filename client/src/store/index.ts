import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import settings from "../config/settings";

const store = configureStore({
  reducer: rootReducer,
  devTools: settings.env === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
