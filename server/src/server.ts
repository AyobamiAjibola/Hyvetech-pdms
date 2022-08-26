import "dotenv/config";

import * as http from "http";

import app from "./app";
import startup from "./startup";
import AppLogger from "./utils/AppLogger";

const logger = AppLogger.init("server").logger;
const server = http.createServer(app);

startup(server).catch(logger.error);
