import React from "react";
import {
  BookOnline,
  Dashboard,
  Groups,
  Payments,
  PeopleTwoTone,
} from "@mui/icons-material";
import { FaCar } from "react-icons/fa";

const SignInPage = React.lazy(
  () => import("../pages/authentication/SignInPage")
);
const WelcomePage = React.lazy(() => import("../pages/landing/WelcomePage"));
const HomePage = React.lazy(
  () => import("../components/layouts/PrivateLayout")
);

export const sideNavs = [
  { name: "Dashboard", path: "/dashboard", Icon: Dashboard },
  { name: "Appointments", path: "/appointments", Icon: BookOnline },
  { name: "Customers", path: "/customers", Icon: Groups },
  { name: "Transactions", path: "/transactions", Icon: Payments },
  { name: "Vehicles", path: "/vehicles", Icon: FaCar },
  { name: "Partners", path: "/partners", Icon: PeopleTwoTone },
];

export const routes = [
  { name: "Welcome", path: "/", Element: WelcomePage, isPublic: true },
  { name: "Sign in", path: "/sign-in", Element: SignInPage, isPublic: true },
  {
    name: "Home",
    path: "*",
    Element: HomePage,
    isPublic: false,
  },
];
