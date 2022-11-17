import queue from "../config/queue";
import smtpClient from "./api/smtpClient";
import { Logger } from "winston";
import AppLogger from "../utils/AppLogger";

export default class QueueManager {
  private declare static queue: string;
  private declare static data: any;
  private static LOG: Logger = AppLogger.init(QueueManager.name).logger;

  public static async dispatch({ queue, data }: any) {
    this.queue = queue;
    this.data = data;

    await this.produce();
  }

  static async getChannel() {
    const client = await queue.client();
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

  private static async consume() {
    const channel = await this.getChannel();

    await channel.assertQueue(this.queue);

    await channel.consume(
      this.queue,
      (msg) => {
        const data = JSON.parse(msg?.content.toString() as string);

        smtpClient.sendEmail(data).catch(this.LOG.error);
      },
      { noAck: true }
    );

    await this.closeChannel();
  }
}
