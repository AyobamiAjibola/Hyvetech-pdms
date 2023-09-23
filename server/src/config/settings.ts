import { appCommonTypes } from "../@types/app-common";
import AppSettings = appCommonTypes.AppSettings;

export const MANAGE_ALL = "manage_all";

export const CREATE_BOOKING = "create_booking";
export const READ_BOOKING = "read_booking";
export const UPDATE_BOOKING = "update_booking";
export const DELETE_BOOKING = "delete_booking";

export const CREATE_USER = "create_user";
export const READ_USER = "read_user";
export const UPDATE_USER = "update_user";
export const DELETE_USER = "delete_user";

export const CREATE_CUSTOMER = "create_customer";
export const READ_CUSTOMER = "read_customer";
export const UPDATE_CUSTOMER = "update_customer";
export const DELETE_CUSTOMER = "delete_customer";

export const CREATE_ROLE = "create_role";
export const READ_ROLE = "read_role";
export const UPDATE_ROLE = "update_role";
export const DELETE_ROLE = "delete_role";

export const CREATE_PLAN = "create_plan";
export const READ_PLAN = "read_plan";
export const UPDATE_PLAN = "update_plan";
export const DELETE_PLAN = "delete_plan";

export const CREATE_TECHNICIAN = "create_technician";
export const READ_TECHNICIAN = "read_technician";
export const UPDATE_TECHINICIN = "update_technician";
export const DELETE_TECHNICIAN = "delete_technician";
export const MANAGE_TECHNICIAN = "manage_technician";

export const CREATE_DRIVER = "create_driver";
export const READ_DRIVER = "read_driver";
export const UPDATE_DRIVER = "update_driver";
export const DELETE_DRIVER = "delete_driver";
export const MANAGER_DRIVER = "manage_driver";

export const CREATE_EXPENSE = "create_expense";
export const READ_EXPENSE = "read_expense";
export const UPDATE_EXPENSE = "update_expense";
export const DELETE_EXPENSE = "delete_expense";

export const CREATE_ESTIMATE = "create_estimate";
export const READ_ESTIMATE = "read_estimate";
export const UPDATE_ESTIMATE = "update_estimate";
export const DELETE_ESTIMATE = "delete_estimate";

export const CREATE_INVOICE = "create_invoice";
export const READ_INVOICE = "read_invoice";
export const UPDATE_INVOICE = "update_invoice";
export const DELETE_INVOICE = "delete_invoice";

export const CREATE_PAYMENT = "create_payment";
export const READ_PAYMENT = "read_payment";
export const UPDATE_PAYMENT = "update_payment";
export const DELETE_PAYMENT = "delete_payment";

export const CREATE_VENDOR = "create_vendor";
export const UPDATE_VENDOR = "update_vendor";
export const READ_VENDOR = "read_vendor";
export const DELETE_VENDOR = "delete_vendor";

export const CREATE_PAYMENT_RECIEVED = "create_payment_received";
export const UPDATE_PAYMENT_RECIEVED = "update_payment_received";
export const READ_PAYMENT_RECIEVED = "read_payment_received";
export const DELETE_PAYMENT_RECIEVED = "delete_payment_received";

export const CREATE_BENEFICIARY = "create_beneficiary";
export const UPDATE_BENEFICIARY = "update_beneficiary";
export const READ_BENEFICIARY = "read_beneficiary";
export const DELETE_BENEFICIARY = "delete_beneficiary";

export const CREATE_EXPENSE_TYPE = "create_expense_type";
export const UPDATE_EXPENSE_TYPE = "update_expense_type";
export const READ_EXPENSE_TYPE = "read_expense_type";
export const DELETE_EXPENSE_TYPE = "delete_expense_type";

export const CREATE_WORKSHOP_PROFILE = "create_workshop_profile";
export const UPDATE_WORKSHOP_PROFILEY = "update_workshop_profile";
export const READ_WORKSHOP_PROFILE = "read_workshop_profile";
export const DELETE_WORKSHOP_PROFILE = "delete_workshop_profile";

export const CREATE_TRANSACTION = "create_transaction";
export const UPDATE_TRANSACTION = "update_transaction";
export const READ_TRANSACTION = "read_transaction";
export const DELETE_TRANSACTION = "delete_transaction";

export const CREATE_ITEM = "create_item";
export const UPDATE_ITEM = "update_item";
export const READ_ITEM = "read_item";
export const DELETE_ITEM = "delete_item";

export const READ_GUEST = "read_guest";

export const VIEW_ANALYTICS = "view_analytics";

const settings: AppSettings = {
  mailer: {
    from: <string>process.env.MAILER_FROM,
    customerSupport: <string>process.env.MAIL_CUSTOMER_SUPPORT,
  },
  sendGrid: {
    apiKey: <string>process.env.SENDGRID_API_KEY,
  },
  cookie: {
    accessToken: process.env.ACCESS_TOKEN as string,
    refreshToken: process.env.REFRESH_TOKEN as string,
    name: process.env.COOKIE_AUTH as string,
    secret: process.env.COOKIE_AUTH_SECRET as string,
  },
  permissions: [
    MANAGE_ALL,

    CREATE_BOOKING,
    READ_BOOKING,
    UPDATE_BOOKING,
    DELETE_BOOKING,

    CREATE_USER,
    READ_USER,
    UPDATE_USER,
    DELETE_USER,

    CREATE_CUSTOMER,
    READ_CUSTOMER,
    UPDATE_CUSTOMER,
    DELETE_CUSTOMER,

    CREATE_ROLE,
    READ_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,

    CREATE_PLAN,
    READ_PLAN,
    UPDATE_PLAN,
    DELETE_PLAN,

    CREATE_TECHNICIAN,
    READ_TECHNICIAN,
    UPDATE_TECHINICIN,
    DELETE_TECHNICIAN,
    MANAGE_TECHNICIAN,

    CREATE_DRIVER,
    READ_DRIVER,
    UPDATE_DRIVER,
    DELETE_DRIVER,
    MANAGER_DRIVER,

    READ_GUEST,

    CREATE_EXPENSE,
    READ_EXPENSE,
    DELETE_EXPENSE,
    UPDATE_EXPENSE,

    CREATE_ESTIMATE,
    READ_ESTIMATE,
    UPDATE_ESTIMATE,
    DELETE_ESTIMATE,

    CREATE_INVOICE,
    READ_INVOICE,
    UPDATE_INVOICE,
    DELETE_INVOICE,

    CREATE_PAYMENT,
    READ_PAYMENT,
    UPDATE_PAYMENT,
    DELETE_PAYMENT,

    CREATE_VENDOR,
    DELETE_VENDOR,
    UPDATE_VENDOR,
    READ_VENDOR,

    CREATE_BENEFICIARY,
    READ_BENEFICIARY,
    UPDATE_BENEFICIARY,
    DELETE_BENEFICIARY,

    CREATE_PAYMENT_RECIEVED,
    READ_PAYMENT_RECIEVED,
    DELETE_PAYMENT_RECIEVED,
    UPDATE_PAYMENT_RECIEVED,

    CREATE_EXPENSE_TYPE,
    READ_EXPENSE_TYPE,
    DELETE_EXPENSE_TYPE,
    UPDATE_EXPENSE_TYPE,

    CREATE_WORKSHOP_PROFILE,
    UPDATE_WORKSHOP_PROFILEY,
    DELETE_WORKSHOP_PROFILE,
    READ_WORKSHOP_PROFILE,

    CREATE_TRANSACTION,
    READ_TRANSACTION,
    DELETE_TRANSACTION,
    UPDATE_TRANSACTION,

    CREATE_ITEM,
    READ_ITEM,
    DELETE_ITEM,
    UPDATE_ITEM,

    VIEW_ANALYTICS,
  ],
  roles: [
    "ADMIN_ROLE",
    "CUSTOMER_ROLE",
    "GUEST_ROLE",
    "USER_ROLE",
    "GARAGE_ADMIN_ROLE",
    "GARAGE_TECHNICIAN_ROLE",
    "RIDE_SHARE_ADMIN_ROLE",
    "RIDE_SHARE_DRIVER_ROLE",
  ],
  termii: {
    host: <string>process.env.TERMII_HOST,
    key: <string>process.env.TERMII_SECRET,
    from: <string>process.env.TERMII_FROM,
  },
  vinProviders: [
    {
      name: <string>process.env.VIN_PROVIDER1,
      apiKey: <string>process.env.VIN_API_KEY1,
      apiPrefix: <string>process.env.VIN_API_PREFIX1,
      apiSecret: <string>process.env.VIN_SECRET_KEY1,
      default: false,
    },
    {
      name: <string>process.env.VIN_PROVIDER2,
      apiKey: <string>process.env.VIN_API_KEY2,
      apiPrefix: <string>process.env.VIN_API_PREFIX2,
      apiSecret: <string>process.env.VIN_SECRET_KEY2,
      default: true,
    },
  ],
  queue: {
    development: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
    production: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
    test: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
  },
  tags: [
    { name: "2/3-Wheeler" },
    { name: "Sedan/SUV/CUV" },
    { name: "Buses/Mini-Van" },
    { name: "Pickup Truck" },
    { name: "0.5 - 3 Ton Truck" },
    { name: "Heavy Duty Truck" },
  ],
  client: {
    host: <string>process.env.CLIENT_HOST,
    ip: <string>process.env.CLIENT_IP,
  },
  website: {
    host: <string>process.env.WEBSITE_HOST,
    ip: <string>process.env.WEBSITE_IP,
  },
  customer: {
    host: <string>process.env.CUSTOMER_APP_HOST,
    ip: <string>process.env.CUSTOMER_APP_IP,
  },
  schedule: {
    name: "Inspection promo timeslot",
    default: true,
    status: "active",
    timeSlots: [
      { id: 1, time: "9am - 11am", available: true, label: "Morning" },
      { id: 2, time: "11am - 1pm", available: true, label: "Late Morning" },
      { id: 3, time: "1pm - 3pm", available: true, label: "Afternoon" },
      { id: 4, time: "3pm - 5pm", available: true, label: "Late Afternoon" },
    ],
  },
  discounts: [
    {
      label: "GWARIMPA_DISTRICT_ONE_TIME_DRIVE_IN",
      description: "Gwarinpa district one time, drive-in discount",
      value: 80.0,
    },
    {
      label: "GWARIMPA_DISTRICT_ONE_TIME_MOBILE",
      description: "Gwarinpa district one time, mobile discount",
      value: 44.44,
    },
  ],
  jwt: {
    key: <string>process.env.JWT_KEY,
    expiry: <string>process.env.JWT_EXPIRY,
  },
  jwtAccessToken: {
    key: <string>process.env.JWT_ACCESS_KEY,
    expiry: <string>process.env.JWT_ACCESS_EXPIRY,
  },
  jwtRefreshToken: {
    key: <string>process.env.JWT_REFRESH_KEY,
    expiry: <string>process.env.JWT_REFRESH_EXPIRY,
  },
  service: {
    env: <string>process.env.NODE_ENV,
    port: <string>process.env.PORT,
    apiRoot: <string>process.env.ROOT_API,
  },
  email: {
    name: <string>process.env.SMTP_CONFIG_NAME,
    host: <string>process.env.SMTP_CONFIG_HOST,
    default: true,
    from: <string>process.env.SMTP_EMAIL_FROM,
    tls: { rejectUnauthorized: false },
    port: <string>process.env.SMTP_CONFIG_PORT,
    auth: {
      user: <string>process.env.SMTP_CONFIG_USERNAME,
      pass: <string>process.env.SMTP_CONFIG_PASSWORD,
    },
    secure: <string>process.env.SMTP_CONFIG_SECURE === "yes",
  },
  amazon: {
    s3: {
      accessKey: <string>process.env.AMAZON_S3_ACCESS_KEY,
      secretCredential: <string>process.env.AMAZON_S3_SECRET_CREDENTIAL,
      bucketName: <string>process.env.AMAZON_S3_BUCKET_NAME,
      region: <string>process.env.AMAZON_S3_REGION,
    },
  },
  kuda: {
    host: <string>process.env.KUDA_API_HOST,
    apiKey: <string>process.env.KUDA_API_KEY,
    email: <string>process.env.KUDA_ACCOUNT_EMAIL,
    tokenUrl: <string>process.env.KUDA_TOKEN_URL,
    transferChargeFee: <string>process.env.KUDA_TRANSFER_CHARGE_FEE,
  },
  transferFee: process.env.TRANSFER_FEE as unknown as number,
  redis: {
    development: {
      database: <string>process.env.REDIS_DEV_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
    production: {
      database: <string>process.env.REDIS_PROD_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
    test: {
      database: <string>process.env.REDIS_TEST_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
  },
  postgres: {
    development: {
      database: <string>process.env.SQL_DEV_DB_NAME,
      dialect: <string>process.env.SQL_DB_DIALECT,
      host: <string>process.env.SQL_DB_HOST,
      username: <string>process.env.SQL_DB_USERNAME,
      password: <string>process.env.SQL_DB_PASSWORD,
      port: <string>process.env.SQL_DB_PORT,
    },
    production: {
      database: <string>process.env.SQL_PROD_DB_NAME,
      dialect: <string>process.env.SQL_DB_DIALECT,
      host: <string>process.env.SQL_DB_HOST,
      username: <string>process.env.SQL_DB_USERNAME,
      password: <string>process.env.SQL_DB_PASSWORD,
      port: <string>process.env.SQL_DB_PORT,
    },
    test: {
      database: <string>process.env.SQL_TEST_DB_NAME,
      dialect: <string>process.env.SQL_DB_DIALECT,
      host: <string>process.env.SQL_DB_HOST,
      username: <string>process.env.SQL_DB_USERNAME,
      password: <string>process.env.SQL_DB_PASSWORD,
      port: <string>process.env.SQL_DB_PORT,
    },
  },
  mongo: {
    development: {
      host: <string>process.env.MONGO_DEV_HOST,
    },
    production: {
      host: <string>process.env.MONGO_PROD_HOST,
    },
    test: {
      host: <string>process.env.MONGO_TEST_HOST,
    },
  },
};

export default settings;
