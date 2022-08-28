declare namespace NodeJS {
  interface ProcessEnv {
    //Environment configuration
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    ROOT_API: string;

    QUEUE_CONN_URL: string;

    //Database configuration
    SQL_DB_HOST: string;
    SQL_DB_USERNAME: string;
    SQL_DB_PASSWORD: string;
    SQL_DB_PORT: string;
    SQL_DB_DIALECT: string;
    SQL_DEV_DB_NAME: string;
    SQL_PROD_DB_NAME: string;
    SQL_TEST_DB_NAME: string;

    //Redis configuration
    REDIS_HOST: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: string;
    REDIS_DEV_DB_NAME: string;
    REDIS_PROD_DB_NAME: string;
    REDIS_TEST_DB_NAME: string;

    MONGO_DEV_HOST: string;
    MONGO_PROD_HOST: string;
    MONGO_TEST_HOST: string;

    JWT_KEY: string; // JWT key
    JWT_EXPIRY: string; // JWT key
    CLIENT_HOST: string;
    CLIENT_HOST_WWW: string;
    CLIENT_IP: string;
    CUSTOMER_APP_HOST: string;
    CUSTOMER_APP_HOST_WWW: string;
    CUSTOMER_APP_IP: string;
    WEBSITE_HOST: string;
    WEBSITE_HOST_WWW: string;
    WEBSITE_IP: string;

    PAYMENT_GW_NAME: string;
    PAYMENT_GW_BASE_URL: string;
    PAYMENT_GW_SECRET_KEY: string;
    PAYMENT_GW_CB_URL: string;
    PAYMENT_GW_WEB_HOOK: string;

    // VIN PROVIDER 1 Start
    VIN_PROVIDER1: string;
    VIN_SECRET_KEY1: string;
    VIN_API_KEY1: string;
    VIN_API_PREFIX1: string;
    //VIN PROVIDER 1 End

    // VIN PROVIDER 2 Start
    VIN_PROVIDER2: string;
    VIN_SECRET_KEY2: string;
    VIN_API_KEY2: string;
    VIN_API_PREFIX2: string;
    //VIN PROVIDER 2 End

    //SMTP EMAIL Config Start
    SMTP_CONFIG_NAME: string;
    SMTP_CONFIG_HOST: string;
    SMTP_CONFIG_USERNAME: string;
    SMTP_CONFIG_PASSWORD: string;
    SMTP_CONFIG_PORT: string;
    SMTP_CONFIG_SECURE: string;
    SMTP_EMAIL_FROM: string;
    SMTP_EMAIL_SIGNATURE: string;
    SMTP_CUSTOMER_CARE_EMAIL: string;
    SMTP_EMAIL_FROM_NAME: string;

    BCRYPT_SALT: string;
  }
}
