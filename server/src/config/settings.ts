import { appCommonTypes } from "../@types/app-common";
import AppSettings = appCommonTypes.AppSettings;

const settings: AppSettings = {
  permissions: [
    "manage_all",

    "create_booking",
    "read_booking",
    "update_booking",
    "delete_booking",

    "create_user",
    "read_user",
    "update_user",
    "delete_user",

    "create_customer",
    "read_customer",
    "update_customer",
    "delete_customer",

    "create_role",
    "read_role",
    "update_role",
    "delete_role",

    "create_plan",
    "read_plan",
    "update_plan",
    "delete_plan",

    "create_technician",
    "read_technician",
    "update_technician",
    "delete_technician",

    "create_driver",
    "read_driver",
    "update_driver",
    "delete_driver",

    "read_guest",
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
    { name: "Heavy Duty" },
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
