"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailConfigRepository_1 = __importDefault(require("../../repositories/EmailConfigRepository"));
const nodemailer_1 = require("nodemailer");
const emailConfigRepository = new EmailConfigRepository_1.default();
const smtpClient = {
    async init() {
        const emailConfig = await emailConfigRepository.findOne({
            where: { default: true },
        });
        return (0, nodemailer_1.createTransport)({
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
            logger: process.env.NODE_ENV === 'development',
            debug: process.env.NODE_ENV === 'development',
        });
    },
    async sendEmail(mail) {
        const client = await this.init();
        try {
            const response = await client.sendMail(mail);
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    },
};
exports.default = smtpClient;
