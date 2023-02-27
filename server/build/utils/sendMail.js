"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const sendMail = async (data) => {
    // 
    const transporter = nodemailer_1.default.createTransport({
        // @ts-ignore
        host: process.env.SMTP_CONFIG_HOST,
        port: process.env.SMTP_CONFIG_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_CONFIG_USERNAME,
            pass: process.env.SMTP_CONFIG_PASSWORD, // generated ethereal password
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail(data);
    console.log(info, "info");
};
exports.sendMail = sendMail;
