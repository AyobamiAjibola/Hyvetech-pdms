"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const app_1 = __importStar(require("./app"));
const startup_1 = __importDefault(require("./startup"));
const AppLogger_1 = __importDefault(require("./utils/AppLogger"));
const socket_io_1 = require("socket.io");
const logger = AppLogger_1.default.init('server').logger;
const port = process.env.PORT || 5050;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: app_1.corsOptions,
});
io.on('connection', socket => {
    logger.info(socket.id);
});
(0, startup_1.default)(io).catch(console.error);
server.listen(port, () => logger.info(`Server running on port: ${port}`));
