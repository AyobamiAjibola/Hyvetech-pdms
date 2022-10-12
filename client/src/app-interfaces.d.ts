declare module "@app-interfaces" {
  import React from "react";
  import { GenericObjectType } from "@app-types";
  import {
    ICheckList,
    ICustomer,
    IJob,
    IPartner,
    IPermission,
    IRideShareDriverSubscription,
    ITechnician,
    IVehicle,
  } from "@app-models";
  import { JwtPayload } from "jsonwebtoken";

  interface IModule {
    customers: { name: string; data: GenericObjectType[] };
    appointments: { name: string; data: GenericObjectType[] };
    vehicles: { name: string; data: GenericObjectType[] };
    transactions: { name: string; data: GenericObjectType[] };
  }

  interface ITableColumnOptions {
    onView?: (args: any) => void;
    onEdit?: (args: any) => void;
    onDelete?: (args: any) => void;
  }

  type CustomJwtPayload = JwtPayload & {
    permissions: IPermission[];
    userId: number;
    [p: string]: any;
  };

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
    result?: T | null;
    results?: T[];
  }

  interface ITab {
    tag?: string;
    name: string;
    Element: ReturnType<JSX.Element>;
  }

  interface AppContextProps {
    showBooking: boolean;
    setShowBooking: React.Dispatch<React.SetStateAction<boolean>>;
    openSideNav: boolean;
    setOpenSideNav: React.Dispatch<React.SetStateAction<boolean>>;
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

  interface CustomerPageContextProps {
    customer?: ICustomer;
    setCustomer: React.Dispatch<React.SetStateAction<ICustomer | undefined>>;
  }

  interface TechniciansPageContextProps {
    showCreate: boolean;
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    showView: boolean;
    setShowView: React.Dispatch<React.SetStateAction<boolean>>;
    detail: ITechnician | null;
    setDetail: React.Dispatch<React.SetStateAction<ITechnician | null>>;
    job: IJob | null;
    setJob: React.Dispatch<React.SetStateAction<IJob | null>>;
    showViewJob: boolean;
    setShowViewJob: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface CheckListsPageContextProps {
    showCreate: boolean;
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    showView: boolean;
    setShowView: React.Dispatch<React.SetStateAction<boolean>>;
    partners: IPartner[];
    setPartners: React.Dispatch<React.SetStateAction<IPartner[]>>;
  }

  interface CheckListPageContextProps {
    checkListId?: number;
    setCheckListId: React.Dispatch<React.SetStateAction<number | undefined>>;
    checkLists: ICheckList[];
    setCheckLists: React.Dispatch<React.SetStateAction<ICheckList[]>>;
  }

  interface PartnerPageContextProps {
    programme?: string;
    setProgramme: React.Dispatch<React.SetStateAction<string>>;
    modeOfService?: string;
    setModeOfService: React.Dispatch<React.SetStateAction<string>>;
    partner: IPartner | null;
    setPartner: React.Dispatch<React.SetStateAction<IPartner | null>>;
  }

  interface DriverVehiclesContextProps {
    viewSub: boolean;
    setViewSub: React.Dispatch<React.SetStateAction<boolean>>;
    driverSub: IRideShareDriverSubscription | null;
    setDriverSub: React.Dispatch<
      React.SetStateAction<IRideShareDriverSubscription | null>
    >;
    vehicle: IVehicle | null;
    setVehicle: React.Dispatch<React.SetStateAction<IVehicle | null>>;
  }

  interface IJobCheckListPageContextProps {
    images: IImageButtonData[];
    setImages: React.Dispatch<React.SetStateAction<IImageButtonData[]>>;
    imageRef: React.RefObject<HTMLInputElement>;
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

  interface IImageButtonData {
    id: any;
    url: string;
    title: string;
    width: string;
    file?: string | File;
  }
}
