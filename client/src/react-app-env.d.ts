/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    //Environment configuration
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_ADMIN_AUTH: string;
    REACT_APP_REST_ROOT: string;
    REACT_APP_SERVER_BASE_URL: string;
    REACT_APP_DRIVER_SERVER_BASE_URL: string;
    REACT_APP_CUSTOMER_BASE_URL: string;
  }
}
