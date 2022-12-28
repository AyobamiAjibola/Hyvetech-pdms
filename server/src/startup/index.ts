import { Server as SocketServer } from 'socket.io';
import { QueueManager } from 'rabbitmq-email-manager';
import { AppAgenda } from 'agenda-schedule-wrapper';
import database from '../config/database';
import dataStore from '../config/dataStore';
import CommandLineRunner from '../helpers/CommandLineRunner';
import { AGENDA_COLLECTION_NAME, QUEUE_EVENTS } from '../config/constants';
import queue from '../config/queue';
import agendaManager from '../services/agendaManager';
import { appEventEmitter } from '../services/AppEventEmitter';
import eventManager from '../services/eventManager';

export default async function startup(io: SocketServer) {
  dataStore.init();
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
  eventManager(io);
}
