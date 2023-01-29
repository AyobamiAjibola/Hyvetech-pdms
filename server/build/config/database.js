"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUrl = void 0;
const path_1 = __importDefault(require("path"));
const sequelize_typescript_1 = require("sequelize-typescript");
const cls_hooked_1 = require("cls-hooked");
const settings_1 = __importDefault(require("./settings"));
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env.NODE_ENV;
const postgresConfig = settings_1.default.postgres[env];
exports.mongoUrl = settings_1.default.mongo[env].host;
const models = path_1.default.resolve(__dirname, '../models');
if (postgresConfig.database) {
    const namespace = (0, cls_hooked_1.createNamespace)(postgresConfig.database);
    sequelize_typescript_1.Sequelize.useCLS(namespace);
}
const sequelize = new sequelize_typescript_1.Sequelize({
    host: postgresConfig.host,
    username: postgresConfig.username,
    password: postgresConfig.password,
    port: +postgresConfig.port,
    database: postgresConfig.database,
    models: [models],
    dialect: postgresConfig.dialect,
    logging: false,
    define: {
        freezeTableName: true,
        underscored: true,
    },
});
const database = {
    init: async () => sequelize.authenticate(),
    mongodb: async () => {
        mongoose_1.default.set('strictQuery', true);
        return mongoose_1.default.connect(exports.mongoUrl);
    },
    sequelize,
};
exports.default = database;
