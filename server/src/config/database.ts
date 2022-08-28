import path from "path";

import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { createNamespace } from "cls-hooked";

import settings from "./settings";
import { appCommonTypes } from "../@types/app-common";
import DatabaseEnv = appCommonTypes.DatabaseEnv;

const env = process.env.NODE_ENV as DatabaseEnv;

const postgresConfig = settings.postgres[env];
export const mongoUrl = <string>settings.mongo[env].host;

const models = path.resolve(__dirname, "../models");

if (postgresConfig.database) {
  const namespace = createNamespace(postgresConfig.database);

  Sequelize.useCLS(namespace);
}

const sequelize = new Sequelize({
  host: postgresConfig.host,
  username: postgresConfig.username,
  password: postgresConfig.password,
  port: +(<string>postgresConfig.port),
  database: postgresConfig.database,
  models: [models],
  dialect: <Dialect>postgresConfig.dialect,
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

const database = {
  init: async () => sequelize.authenticate(),
  sequelize,
};

export default database;
