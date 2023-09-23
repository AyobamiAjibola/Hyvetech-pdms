import { appModelTypes } from "./app-model";
import Permission from "../models/Permission";
import type { Fields, Files } from "formidable";
import type { Attributes } from "sequelize";
import IncomingForm from "formidable/Formidable";
import User from "../models/User";

import CheckList from "../models/CheckList";
import Transaction from "../models/Transaction";

export declare namespace appCommonTypes {
  import IPermission = appModelTypes.IPermission;

  type DatabaseEnv = "development" | "production" | "test";
  type CheckListAnswerType = {
    id: string;
    answer: string;
    weight: string;
    color: string;
    selected?: boolean;
  };
  type CheckListQuestionType = {
    id: string;
    question: string;
    media: boolean;
    note?: boolean;
    images?: Array<IImageButtonData>;
    text?: string;
    answers: Array<CheckListAnswerType>;
  };
  type CheckListSectionType = {
    id: string;
    title: string;
    questions: Array<CheckListQuestionType>;
  };
  type CheckListType = Partial<Omit<CheckList, "sections">> & {
    sections: Array<CheckListSectionType>;
  };
  type Roles =
    | "ADMIN_ROLE"
    | "GUEST_ROLE"
    | "USER_ROLE"
    | "CUSTOMER_ROLE"
    | "GARAGE_ADMIN_ROLE"
    | "GARAGE_TECHNICIAN_ROLE"
    | "RIDE_SHARE_ADMIN_ROLE"
    | "RIDE_SHARE_DRIVER_ROLE";
  type Permissions =
    | "manage_all"
    | "create_booking"
    | "read_booking"
    | "update_booking"
    | "delete_booking"
    | "create_user"
    | "read_user"
    | "update_user"
    | "delete_user"
    | "create_customer"
    | "read_customer"
    | "update_customer"
    | "delete_customer"
    | "create_role"
    | "read_role"
    | "update_role"
    | "delete_role"
    | "create_plan"
    | "read_plan"
    | "update_plan"
    | "delete_plan"
    | "create_technician"
    | "read_technician"
    | "update_technician"
    | "delete_technician"
    | "manage_technician"
    | "create_driver"
    | "read_driver"
    | "update_driver"
    | "delete_driver"
    | "manage_driver"
    | "read_guest"
    | "read_expense"
    | "update_expense"
    | "delete_expense"
    | "create_expense"
    | "read_invoice"
    | "update_invoice"
    | "delete_invoice"
    | "create_invoice"
    | "read_payment"
    | "create_payment"
    | "update_payment"
    | "delete_payment"
    | "create_estimate"
    | "read_estimate"
    | "delete_estimate"
    | "update_estimate"
    | "create_vendor"
    | "read_vendor"
    | "delete_vendor"
    | "update_vendor"
    | "create_beneficiary"
    | "read_beneficiary"
    | "delete_beneficiary"
    | "update_beneficiary"
    | "create_payment_received"
    | "update_payment_received"
    | "delete_payment_received"
    | "read_payment_received"
    | "create_expense_type"
    | "update_expense_type"
    | "delete_expense_type"
    | "delete_expense_type"
    | "read_expense_type"
    | "create_workshop_profile"
    | "update_workshop_profile"
    | "delete_workshop_profile"
    | "update_workshop_profile"
    | "read_workshop_profile"
    | "create_transaction"
    | "update_transaction"
    | "delete_transaction"
    | "read_transaction"
    | "create_item"
    | "read_item"
    | "delete_item"
    | "update_item"
    | "view_analytics";

  type VINProvider = {
    name: string;
    apiSecret: string;
    apiKey: string;
    apiPrefix: string;
    default: boolean;
  };

  type AuthPayload = {
    permissions: IPermission[];
    userId: number;
    partnerId?: number;
    rideShareDriverId?: number;
    customer?: number;
    pass?: string;
  };

  type CustomJwtPayload = JwtPayload & AuthPayload;

  type AppRequestParams = {
    customerId: string;
    appointmentId: string;
    driverId: string;
  };

  type QueueMailTypes =
    | "DEFAULT"
    | "WEBSITE"
    | "BOOKING"
    | "CUSTOMER"
    | "email";
  type AnyObjectType = { [p: string]: any };

  export type IPartWarranty = { warranty: string; interval: string };
  export type IPartQuantity = { quantity: string; unit: string };

  export interface IPart {
    name: string;
    warranty: IPartWarranty;
    quantity: IPartQuantity;
    price: string;
  }

  export interface ILabour {
    title: string;
    cost: string;
  }

  export interface IEstimateValues {
    parts: IPart[];
    labours: ILabour[];
    tax: string;
    vin: string;
    make: string;
    model: string;
    modelYear: string;
    plateNumber: string;
    mileage: { count: string; unit: string };
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    depositAmount: string;
    jobDuration: { count: string; interval: string };
  }

  interface DatabaseConfig {
    host?: string;
    username?: string;
    password?: string;
    port?: string;
    dialect?: string;
    database?: string;
  }

  interface AppSettings {
    termii: {
      host: string;
      key: string;
      from: string;
    };
    mailer: {
      from: string;
      customerSupport: string;
    };
    sendGrid: {
      apiKey: string;
    };
    postgres: Record<DatabaseEnv, DatabaseConfig>;
    redis: Record<DatabaseEnv, DatabaseConfig>;
    mongo: Record<DatabaseEnv, DatabaseConfig>;
    queue: Record<DatabaseEnv, DatabaseConfig>;
    cookie: { 
      accessToken: string;
      refreshToken: string;
      name: string;
      secret: string;
    };
    vinProviders: VINProvider[];
    roles: Roles[];
    permissions: Permissions[];
    tags: any[];
    kuda: {
      host: string;
      apiKey: string;
      email: string;
      tokenUrl: string;
      transferChargeFee: string;
    };
    amazon: {
      s3: {
        accessKey: string;
        secretCredential: string;
        bucketName: string;
        region: string;
      };
    };
    transferFee: number;
    email: {
      name?: string;
      host?: string;
      default?: boolean;
      from?: string;
      auth: { user?: string; pass?: string };
      secure?: boolean;
      port?: string;
      tls?: {
        rejectUnauthorized?: boolean;
      };
      signature?: string;
    };
    service: {
      port: string;
      env: string;
      apiRoot?: string;
    };
    schedule: {
      name: string;
      default: boolean;
      status: string;
      timeSlots: ReadonlyArray<any>;
    };
    discounts: ReadonlyArray<any>;
    jwt: { key: string; expiry: string };
    jwtAccessToken: { key: string; expiry: string };
    jwtRefreshToken: { key: string; expiry: string };
    client: {
      host: string;
      ip: string;
    };
    website: {
      host: string;
      ip: string;
    };
    customer: {
      host: string;
      ip: string;
    };
  }

  interface HttpResponse<T> {
    message: string;
    code: number;
    timestamp?: string;
    result?: T | null;
    results?: T[];
    tokens?: {
      jwt: string;
      accessToken: string;
      refreshToken: string;
    } 
  }

  type AsyncWrapper = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  interface RouteEndpointConfig {
    name: string;
    path: string;
    method: string;
    handler: AsyncWrapper;
    hasRole?: string;
    hasAuthority?: string;
    hasAnyRole?: string[];
    hasAnyAuthority?: string[];
  }

  type RouteEndpoints = RouteEndpointConfig[];

  interface RedisDataStoreOptions {
    PX: number | string; //Expiry date in milliseconds
  }

  interface VinProviderConfig {
    provider: string;
    apiKey: string;
    secretKey?: string;
  }

  interface MailBody {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
    text?: string;
    domain?: string;
    callToAction?: string;
    signature?: string;
    url?: string;
  }

  interface MailTextConfig {
    subName?: string;
    firstName?: string;
    lastName?: string;
    numOfInspections?: number;
    numOfVehicles?: string;
    planCategory?: string;
    partner?: any;
    vehichleData?: any;
    username?: string;
    password?: string;
    appointmentDate?: string;
    location?: string;
    vehicleDetail?: {
      year: string;
      make: string;
      model: string;
    };
    vehicleFault?: string;
    loginUrl?: string;
    whatsappUrl?: string;
    estimate?: any;
  }

  interface BcryptPasswordEncoder {
    encode(rawPassword: string): Promise<string>;

    match(rawPassword: string, hash: string): Promise<boolean>;
  }

  interface SubscriptionIntervalOptions {
    paymentPlan?: string;
    price?: number;
    name?: string;
    planCategory?: string;
  }

  interface ISchedule {
    date: string;
    slots: any[];
  }

  interface PlanInspectionsOptions {
    defaultInspections: number;
    currentInspections: number;
  }

  interface QueueEvents {
    name: QueueMailTypes;
  }

  interface IImageButtonData {
    id: any;
    url: string;
    title: string;
    width: string;
    questionId?: any;
    file?: any;
  }

  interface IDepositForEstimate {
    customerId: number;
    invoiceId: number;
    estimateId: number;
    partnerId: number;
    vin: string;
    depositAmount: number;
    dueAmount: number;
    grandTotal: number;
  }

  interface IGenerateInvoice {
    txnRef: string;
    estimateId: number;
    transaction: Transaction;
  }

  interface IFirebaseData {
    title?: string;
    message?: string;
    subtitle?: string;
    sound?: boolean | string;
    vibrate?: boolean | number[];
    priority?: "min" | "low" | "default" | "high" | "max";
    badge?: number;
  }

  interface IInitTransaction {
    authorizationUrl: string;
    accessCode?: string;
    reference: string;
    invoiceId?: number;
  }
}

declare global {
  namespace Express {
    export interface Request {
      files: Files;
      fields: Fields;
      permissions: Attributes<Permission>[];
      user: User;
      form: IncomingForm;
      jwt: string;
      data: string;
      isTokenExpired: boolean;
    }
  }
}
