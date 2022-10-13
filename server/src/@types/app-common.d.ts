import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { appModelTypes } from "./app-model";
import Permission from "../models/Permission";
import { Fields, Files } from "formidable";
import { Attributes } from "sequelize";
import IncomingForm from "formidable/Formidable";
import User from "../models/User";

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
  type CheckListType = {
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
    | "read_guest";
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
    customer?: number;
    pass?: string;
  };

  type CustomJwtPayload = JwtPayload & AuthPayload;

  type AppRequestParams = { customerId: string; appointmentId: string };

  type QueueMailTypes = "DEFAULT" | "WEBSITE" | "BOOKING" | "CUSTOMER";

  interface DatabaseConfig {
    host?: string;
    username?: string;
    password?: string;
    port?: string;
    dialect?: string;
    database?: string;
  }

  interface AppSettings {
    postgres: Record<DatabaseEnv, DatabaseConfig>;
    redis: Record<DatabaseEnv, DatabaseConfig>;
    mongo: Record<DatabaseEnv, DatabaseConfig>;
    queue: Record<DatabaseEnv, DatabaseConfig>;
    vinProviders: VINProvider[];
    roles: Roles[];
    permissions: Permissions[];
    tags: any[];
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
    numOfInspections?: number;
    numOfVehicles?: string;
    planCategory?: string;
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
    file?: string | File;
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
    }
  }
}
