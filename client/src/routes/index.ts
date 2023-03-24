// @ts-nocheck
import {
  BookOnline,
  CurrencyExchange,
  Calculate,
  Dashboard,
  // Garage,
  Groups,
  Handshake,
  // History,
  Paid,
  // HomeRepairService,
  Payments,
  PlaylistAddCheck,
  Receipt,
  SvgIconComponent,
  TaxiAlert,
  TimeToLeave,
} from '@mui/icons-material';
import React from 'react';

export interface ISideNav {
  tag: string;
  name: string;
  path: string;
  Icon: SvgIconComponent;
}

const SignInPage = React.lazy(() => import('../pages/authentication/SignInPage'));
const GarageSignInPage = React.lazy(() => import('../pages/authentication/GarageSignInPage'));
const GarageSignUpPage = React.lazy(() => import('../pages/authentication/GarageSignUpPage'));
const HomePage = React.lazy(() => import('../context/AppContextProvider'));

export const sideNavs: ISideNav[] = [
  { tag: 'all', name: 'Dashboard', path: '/dashboard', Icon: Dashboard },
  {
    tag: 'techs',
    name: 'Dasboard',
    path: '/dashboard',
    Icon: Dashboard,
  },

  { tag: 'super', name: 'Customers', path: '/customers', Icon: Groups },
  { tag: 'techs', name: 'Customers', path: '/customers', Icon: Groups },
  {
    tag: 'super',
    name: 'Check Lists',
    path: '/checkLists',
    Icon: PlaylistAddCheck,
  },
  {
    tag: 'techs',
    name: 'Estimates',
    path: '/estimates',
    // Icon: RequestQuote,
    Icon: Calculate,
  },

  {
    tag: 'super',
    name: 'Invoices',
    path: '/invoices',
    Icon: Receipt,
  },
  {
    tag: 'techs',
    name: 'Payments Received',
    path: '/payment-recieved',
    Icon: Paid,
  },
  {
    tag: 'techs',
    name: 'Expenses',
    path: '/expenses',
    Icon: CurrencyExchange,
  },
  { tag: 'drivers', name: 'Drivers', path: '/drivers', Icon: TaxiAlert },
  // {
  //   tag: 'techs',
  //   name: 'Technicians',
  //   path: '/technicians',
  //   Icon: HomeRepairService,
  // },
  { tag: 'super', name: 'Partners', path: '/partners', Icon: Handshake },
  {
    tag: 'super',
    name: 'Appointments',
    path: '/appointments',
    Icon: BookOnline,
  },
  { tag: 'super', name: 'Transactions', path: '/transactions', Icon: Payments },
  { tag: 'super', name: 'Vehicles', path: '/vehicles', Icon: TimeToLeave },
];

export const routes = [
  { name: 'Sign in', path: '/', Element: SignInPage, isPublic: true },
  { name: 'Workshop Login', path: '/garage/login', Element: GarageSignInPage, isPublic: true },
  { name: 'Workshop Register', path: '/garage/register', Element: GarageSignUpPage, isPublic: true },
  {
    name: 'Home',
    path: '*',
    Element: HomePage,
    isPublic: false,
  },
];
