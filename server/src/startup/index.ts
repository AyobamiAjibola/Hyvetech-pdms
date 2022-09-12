import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { QueueManager } from "rabbitmq-email-manager";
import { AppAgenda } from "agenda-schedule-wrapper";

import AppLogger from "../utils/AppLogger";
import database from "../config/database";
import dataStore from "../config/dataStore";
import CommandLineRunner from "../helpers/CommandLineRunner";
import { AGENDA_COLLECTION_NAME, QUEUE_EVENTS } from "../config/constants";
import queue from "../config/queue";
import agendaManager from "../services/agendaManager";
import { appEventEmitter } from "../services/AppEventEmitter";
import socketManager from "../services/socketManager";

const logger = AppLogger.init(startup.name).logger;

export default async function startup(server: HttpServer, io: SocketServer) {
  const port = process.env.PORT || 5050;

  await dataStore.init({ flush: true });
  await database.init();
  const mongodb = await database.mongodb();
  await database.sequelize.sync({ alter: true });
  await CommandLineRunner.run();

  await QueueManager.init({
    queueClient: queue.client,
    queue: QUEUE_EVENTS.name,
  });

  await AppAgenda.init({
    db: mongodb,
    collection: AGENDA_COLLECTION_NAME,
  });

  agendaManager(appEventEmitter);
  socketManager(io);

  server.listen(port, () => logger.info(`Server running on port: ${port}`));
}