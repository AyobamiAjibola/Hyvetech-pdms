import EmailConfigRepository from "../../repositories/EmailConfigRepository";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";

const emailConfigRepository = new EmailConfigRepository();

const smtpClient = {
  async init() {
    const emailConfig = await emailConfigRepository.findOne({
      where: { default: true },
    });

    return createTransport({
      name: emailConfig?.name,
      host: emailConfig?.host,
      from: emailConfig?.from,
      auth: {
        user: emailConfig?.username,
        pass: emailConfig?.password,
      },
      port: emailConfig?.port,
      secure: emailConfig?.secure,
      pool: true,
      maxConnections: 100,
      maxMessages: Infinity,
      logger: process.env.NODE_ENV === "development",
      debug: process.env.NODE_ENV === "development",
    });
  },
  async sendEmail(mail: MailOptions) {
    const client = await this.init();

    try {
      const response = await client.sendMail(mail);
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default smtpClient;
