import * as http from "http";

import "dotenv/config";

import app, { corsOptions } from "./app";
import startup from "./startup";
import AppLogger from "./utils/AppLogger";
import { Server as SocketServer } from "socket.io";

const logger = AppLogger.init("server").logger;
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  logger.info(socket.id);
});

startup(server, io).catch(console.error);
