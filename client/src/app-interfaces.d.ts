declare module "@app-interfaces" {
  import React from "react";
  import { GenericObjectType } from "@app-types";
  import { ICustomer, IVehicle } from "@app-models";

  interface IModule {
    customers: { name: string; data: GenericObjectType[] };
    appointments: { name: string; data: GenericObjectType[] };
    vehicles: { name: string; data: GenericObjectType[] };
    transactions: { name: string; data: GenericObjectType[] };
  }

  interface IThunkAPIPayloadError {
    message: string;
  }

  interface IDriversFilterData {
    id: number;
    fullName: string;
    query: string;
  }

  interface IDashboardData {
    dailyData: IModule;
    monthlyData: IModule;
  }

  interface AppContextProps {
    showBooking: boolean;
    setShowBooking: React.Dispatch<React.SetStateAction<boolean>>;
    showBookingBtn: boolean;
    setShowBookingBtn: React.Dispatch<React.SetStateAction<boolean>>;
    checkedSlot: boolean;
    setCheckedSlot: React.Dispatch<React.SetStateAction<boolean>>;
    planTab: number;
    setPlanTab: React.Dispatch<React.SetStateAction<number>>;
    mobileDate: boolean;
    setMobileDate: React.Dispatch<React.SetStateAction<boolean>>;
    showTime: boolean;
    setShowTime: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    customer: ICustomer | null;
    setCustomer: React.Dispatch<React.SetStateAction<ICustomer | null>>;
    vehicle: IVehicle | null;
    setVehicle: React.Dispatch<React.SetStateAction<IVehicle | null>>;
    vehicles: IVehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<IVehicle[]>>;
    showVehicles: boolean;
    setShowVehicles: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface ISignInModel {
    username: string;
    password: string;
  }

  interface ISignUpModel {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  interface HttpResponse<T> {
    message: string;
    code: number;
    timestamp?: string;
    result?: T;
    results?: T[];
  }

  interface ITab {
    tag?: string;
    name: string;
    Element: ReturnType<JSX.Element>;
  }

  interface CustomerPageContextProps {
    customer?: ICustomer;
    setCustomer: React.Dispatch<React.SetStateAction<ICustomer | undefined>>;
  }

  interface PartnerPageContextProps {
    programme?: string;
    setProgramme: React.Dispatch<React.SetStateAction<string>>;
    modeOfService?: string;
    setModeOfService: React.Dispatch<React.SetStateAction<string>>;
  }

  export interface IComponentErrorState {
    hasError: boolean;
    errorMessage: string;
  }

  interface ApiResponseSuccess<T> {
    message: string;
    code: number;
    timestamp?: string;
    result?: T;
    results?: T[];
  }

  interface ApiResponseError {
    message: string;
    code: number;
  }
}
