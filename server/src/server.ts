import https, { ServerOptions } from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

import 'dotenv/config';

import app, { corsOptions } from './app';
import startup from './startup';
import AppLogger from './utils/AppLogger';
import { Server as SocketServer } from 'socket.io';
import settings from './config/settings';


const logger = AppLogger.init('server').logger;
const port = process.env.PORT || 5050;


if (settings.service.env === 'production') {
  const serverOptions: ServerOptions = {
    key: fs.readFileSync(path.resolve(process.env.SSL_KEY_FILE as string)),
    cert: fs.readFileSync(path.resolve(process.env.SSL_CRT_FILE as string)),
  };

  const server = https.createServer(serverOptions, app);
  server.listen(port, () => logger.info(`Server running on port: ${port}`));
  const io = new SocketServer(server, {
    cors: corsOptions,
  });

  io.on('connection', socket => {
    logger.info(socket.id);
  });

  startup(io).catch(console.error);
} else {
  const server = http.createServer(app);
  server.listen(port, () => logger.info(`Server running on port: ${port}`));
  const io = new SocketServer(server, {
    cors: corsOptions,
  });

  io.on('connection', socket => {
    logger.info(socket.id);
  });

  startup(io).catch(console.error);
}



