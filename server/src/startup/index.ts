import { Server } from "http";
import AppLogger from "../utils/AppLogger";
import database, { mongoUrl } from "../config/database";
import dataStore from "../config/dataStore";
import CommandLineRunner from "../helpers/CommandLineRunner";
import { QueueManager } from "rabbitmq-email-manager";
import { AppAgenda } from "agenda-schedule-wrapper";
import { AGENDA_COLLECTION_NAME, QUEUE_EVENTS } from "../config/constants";
import queue from "../config/queue";
import eventManager from "../services/eventManager";
import { appEventEmitter } from "../services/AppEventEmitter";

const logger = AppLogger.init(startup.name).logger;

export default async function startup(server: Server) {
  const port = process.env.PORT || 5050;

  await dataStore.init({ flush: true });
  await database.init();
  await database.sequelize.sync({ alter: true });
  await CommandLineRunner.run();

  await QueueManager.init({
    queueClient: queue.client,
    queue: QUEUE_EVENTS.name,
  });

  await AppAgenda.init({
    dbUrl: mongoUrl,
    collection: AGENDA_COLLECTION_NAME,
  });

  eventManager(appEventEmitter);

  server.listen(port, () => logger.info(`Server running on port: ${port}`));
}
