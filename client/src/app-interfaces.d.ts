declare module '@app-interfaces' {
  import React from 'react';
  import { AnyObjectType } from '@app-types';
  import {
    Accounts,
    ICheckList,
    ICustomer,
    ICustomerSubscription,
    IEstimate,
    IItem,
    IJob,
    IPartner,
    IPermission,
    IRideShareDriver,
    IRideShareDriverSubscription,
    IServiceReminder,
    ITechnician,
    IVehicle,
  } from '@app-models';
  import { JwtPayload } from 'jsonwebtoken';

  interface IModule {
    customers: { name: string; data: AnyObjectType[] };
    // appointments: { name: string; data: AnyObjectType[] };
    vehicles: { name: string; data: AnyObjectType[] };
    transactions: { name: string; data: AnyObjectType[] };
    // sales: { name: string; data: AnyObjectType[] };
    expenses: { name: string; data: AnyObjectType[] };
  }

  interface ITableColumnOptions {
    onView?: (args: any) => void;
    onEdit?: (args: any) => void;
    onDelete?: (args: any) => void;
  }

  type CustomJwtPayload = JwtPayload & {
    permissions: IPermission[];
    userId: number;
    partnerId?: number;
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

  interface IPartFilterData {
    id: number;
    name: string;
    query: string
  }

  interface IItemFilterData {
    id: number;
    name: string;
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
    disableTab?: boolean;
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
    driver: IRideShareDriver | null;
    setDriver: React.Dispatch<React.SetStateAction<IRideShareDriver | null>>;
    vehicle: IVehicle | null;
    setVehicle: React.Dispatch<React.SetStateAction<IVehicle | null>>;
    vehicles: IVehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<IVehicle[]>>;
    showVehicles: boolean;
    setShowVehicles: React.Dispatch<React.SetStateAction<boolean>>;
    accounts: Accounts | null;
    setAccounts: React.Dispatch<React.SetStateAction<Accounts | null>>;
  }

  interface CustomerPageContextProps {
    customer?: ICustomer;
    setCustomer: React.Dispatch<React.SetStateAction<ICustomer | undefined>>;
  }

  interface DriverPageContextProps {
    driver?: IRideShareDriver;
    setDriver: React.Dispatch<React.SetStateAction<IRideShareDriver | undefined>>;
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
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface DriverVehiclesContextProps {
    viewSub: boolean;
    setViewSub: React.Dispatch<React.SetStateAction<boolean>>;
    driverSub: IRideShareDriverSubscription | null;
    setDriverSub: React.Dispatch<React.SetStateAction<IRideShareDriverSubscription | null>>;
    customerSub: ICustomerSubscription | null;
    setCustomerSub: React.Dispatch<React.SetStateAction<ICustomerSubscription | null>>;
    vehicle: IVehicle | null;
    setVehicle: React.Dispatch<React.SetStateAction<IVehicle | null>>;
  }

  interface IJobCheckListPageContextProps {
    images: IImageButtonData[];
    setImages: React.Dispatch<React.SetStateAction<IImageButtonData[]>>;
    imageRef: React.RefObject<HTMLInputElement>;
  }

  interface RideShareDriverPageContextProps {
    driver: IRideShareDriver | null;
    setDriver: React.Dispatch<React.SetStateAction<IRideShareDriver | null>>;
  }

  interface EstimatePageContextProps {
    driver: IRideShareDriver | null;
    setDriver: React.Dispatch<React.SetStateAction<IRideShareDriver | null>>;
    estimates: IEstimate[];
    setEstimates: React.Dispatch<React.SetStateAction<IEstimate[]>>;
    showCreate: boolean;
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface ItemPageContextProps {
    items: IItem[];
    setItems: React.Dispatch<React.SetStateAction<IItem[]>>;
    showCreate: boolean;
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface ReminderPageContextProps {
    reminders: IServiceReminder[];
    setReminders: React.Dispatch<React.SetStateAction<IServiceReminder[]>>;
    showCreate: boolean;
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
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
    tokens?: {
      jwt: string;
      accessToken: string;
      refreshToken: string;
    }
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
    questionId?: any;
    file?: File;
    partner?: any;
  }

  interface IVINDecoderSchema {
    label: string;
    value: any;
  }

  interface ILocationState {
    customerId?: number;
    customer?: ICustomer;
    driverId?: number;
    driver?: IRideShareDriver;
  }

  interface IInitTransaction {
    authorizationUrl: string;
    accessCode?: string;
    invoiceId?: number;
    reference: string;
  }
}
