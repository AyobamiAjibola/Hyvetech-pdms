"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_email_manager_1 = require("rabbitmq-email-manager");
const agenda_schedule_wrapper_1 = require("agenda-schedule-wrapper");
const database_1 = __importDefault(require("../config/database"));
const dataStore_1 = __importDefault(require("../config/dataStore"));
const constants_1 = require("../config/constants");
const queue_1 = __importDefault(require("../config/queue"));
const agendaManager_1 = __importDefault(require("../services/agendaManager"));
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const eventManager_1 = __importDefault(require("../services/eventManager"));
async function startup(io) {
    dataStore_1.default.init();
    await database_1.default.init();
    const mongodb = await database_1.default.mongodb();
    await database_1.default.sequelize.sync({ alter: true });
    console.log('reac0');
    // await CommandLineRunner.run();
    console.log('reac');
    await rabbitmq_email_manager_1.QueueManager.init({
        queueClient: queue_1.default.client,
        queue: constants_1.QUEUE_EVENTS.name,
    });
    await agenda_schedule_wrapper_1.AppAgenda.init({
        db: mongodb,
        collection: constants_1.AGENDA_COLLECTION_NAME,
    });
    (0, agendaManager_1.default)(AppEventEmitter_1.appEventEmitter);
    (0, eventManager_1.default)(io);
}
exports.default = startup;
