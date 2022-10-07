import React from "react";
import {
  BookOnline,
  Dashboard,
  Garage,
  Groups,
  Handshake,
  HomeRepairService,
  Payments,
  PlaylistAddCheck,
  SvgIconComponent,
  TaxiAlert,
  TimeToLeave,
} from "@mui/icons-material";

export interface ISideNav {
  tag: string;
  name: string;
  path: string;
  Icon: SvgIconComponent;
}

const SignInPage = React.lazy(
  () => import("../pages/authentication/SignInPage")
);
const WelcomePage = React.lazy(() => import("../pages/landing/WelcomePage"));
const HomePage = React.lazy(() => import("../context/AppContextProvider"));

export const sideNavs: ISideNav[] = [
  { tag: "all", name: "Dashboard", path: "/dashboard", Icon: Dashboard },
  { tag: "super", name: "Customers", path: "/customers", Icon: Groups },
  {
    tag: "super",
    name: "Check Lists",
    path: "/checkLists",
    Icon: PlaylistAddCheck,
  },
  { tag: "drivers", name: "Drivers", path: "/drivers", Icon: TaxiAlert },
  {
    tag: "techs",
    name: "Technicians",
    path: "/technicians",
    Icon: HomeRepairService,
  },
  {
    tag: "techs",
    name: "Manage Garage",
    path: "/garage",
    Icon: Garage,
  },
  { tag: "super", name: "Partners", path: "/partners", Icon: Handshake },
  {
    tag: "super",
    name: "Appointments",
    path: "/appointments",
    Icon: BookOnline,
  },
  { tag: "super", name: "Transactions", path: "/transactions", Icon: Payments },
  { tag: "super", name: "Vehicles", path: "/vehicles", Icon: TimeToLeave },
];

export const routes = [
  { name: "Welcome", path: "/", Element: WelcomePage, isPublic: true },
  { name: "Sign in", path: "/sign-in", Element: SignInPage, isPublic: true },
  {
    name: "Partner Sign in",
    path: "/partner/sign-in",
    Element: SignInPage,
    isPublic: true,
  },
  {
    name: "Home",
    path: "*",
    Element: HomePage,
    isPublic: false,
  },
];
