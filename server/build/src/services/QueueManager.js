"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = __importDefault(require("../config/queue"));
const smtpClient_1 = __importDefault(require("./api/smtpClient"));
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
class QueueManager {
    static LOG = AppLogger_1.default.init(QueueManager.name).logger;
    static async dispatch({ queue, data }) {
        this.queue = queue;
        this.data = data;
        await this.produce();
    }
    static async getChannel() {
        const client = await queue_1.default.client();
        return client.createChannel();
    }
    static async closeChannel() {
        const channel = await this.getChannel();
        await channel.close();
    }
    static async produce() {
        const channel = await this.getChannel();
        await channel.assertQueue(this.queue);
        await channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(this.data)));
    }
    static async consume() {
        const channel = await this.getChannel();
        await channel.assertQueue(this.queue);
        await channel.consume(this.queue, msg => {
            const data = JSON.parse(msg?.content.toString());
            smtpClient_1.default.sendEmail(data).catch(this.LOG.error);
        }, { noAck: true });
        await this.closeChannel();
    }
}
exports.default = QueueManager;
