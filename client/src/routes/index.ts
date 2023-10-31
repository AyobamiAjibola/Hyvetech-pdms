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
  HomeRepairService,
  PostAdd,
  DateRange,
  AccountBalance,
} from '@mui/icons-material';
import React from 'react';

import { HyvePayIconWrapper } from './CustomIcons';

export interface ISideNav {
  tag: string;
  name: string;
  path: string;
  Icon: SvgIconComponent;
}

// const SignInPage = React.lazy(() => import('../pages/authentication/SignInPage'));
// const SignIn = React.lazy(() => import('../pages/authentication/SignIn'));
const SignInPageAdmin = React.lazy(() => import('../pages/authentication/SignInPageAdmin'));
// const GarageSignInPage = React.lazy(() => import('../pages/authentication/GarageSignInPage'));
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
  {
    tag: 'techs',
    name: 'HyvePay',
    path: '/hyvePay',
    Icon: HyvePayIconWrapper,
  },
  {
    tag: 'super',
    name: 'Virtual Accounts',
    path: '/virtual/accounts',
    Icon: AccountBalance,
  },
  {
    tag: 'super',
    name: 'Main Account Transactions',
    path: '/hyvepay/transactions',
    Icon: HyvePayIconWrapper,
  },
  { tag: 'super', name: 'Customers', path: '/customers', Icon: Groups },
  { tag: 'super', name: 'KYC Requests', path: '/kyc/requests', Icon: Groups },
  { tag: 'techs', name: 'Customers', path: '/customers', Icon: Groups },
  {
    tag: 'techs',
    name: 'Items & Inventory',
    path: '/items',
    Icon: PostAdd,
  },
  {
    tag: 'techs',
    name: 'Service Reminders',
    path: '/reminders',
    Icon: DateRange,
  },
  // {
  //   tag: 'super',
  //   name: 'Check Lists',
  //   path: '/checkLists',
  //   Icon: PlaylistAddCheck,
  // },
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
  // { tag: 'drivers', name: 'Drivers', path: '/drivers', Icon: TaxiAlert },
  // {
  //   tag: 'techs',
  //   name: 'Technicians',
  //   path: '/technicians',
  //   Icon: HomeRepairService,
  // },
  // { tag: 'super', name: 'Partners', path: '/partners', Icon: Handshake },
  // {
  //   tag: 'super',
  //   name: 'Appointments',
  //   path: '/appointments',
  //   Icon: BookOnline,
  // },
  // { tag: 'super', name: 'Transactions', path: '/transactions', Icon: Payments },
  { tag: 'super', name: 'Vehicles', path: '/vehicles', Icon: TimeToLeave },
  { tag: 'super', name: 'HyveCloud Users', path: '/workshops', Icon: HomeRepairService },
];

export const routes = [
  { name: 'Sign in admin', path: '/', Element: SignInPageAdmin, isPublic: true },
  // { name: 'Sign in admin', path: '/admin', Element: SignInPageAdmin, isPublic: true },
  // { name: 'Workshop Login', path: '/garage/login', Element: SignInPage, isPublic: true },
  { name: 'Workshop Register', path: '/garage/register', Element: GarageSignUpPage, isPublic: true },
  {
    name: 'Home',
    path: '*',
    Element: HomePage,
    isPublic: false,
  },
];
