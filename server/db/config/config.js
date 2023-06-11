// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  development: {
    database: process.env.SQL_DEV_DB_NAME,
    dialect: process.env.SQL_DB_DIALECT,
    host: process.env.SQL_DB_HOST,
    username: process.env.SQL_DB_USERNAME,
    password: process.env.SQL_DB_PASSWORD,
    port: process.env.SQL_DB_PORT,
  },
  production: {
    database: process.env.SQL_PROD_DB_NAME,
    dialect: process.env.SQL_DB_DIALECT,
    host: process.env.SQL_DB_HOST,
    username: process.env.SQL_DB_USERNAME,
    password: process.env.SQL_DB_PASSWORD,
    port: process.env.SQL_DB_PORT,
  },
  test: {
    database: process.env.SQL_TEST_DB_NAME,
    dialect: process.env.SQL_DB_DIALECT,
    host: process.env.SQL_DB_HOST,
    username: process.env.SQL_DB_USERNAME,
    password: process.env.SQL_DB_PASSWORD,
    port: process.env.SQL_DB_PORT,
  },
};
