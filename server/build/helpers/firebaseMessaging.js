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
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
function firebaseMessaging(config) {
    let app;
    if (config && config.serviceAccount) {
        app = admin.initializeApp({ credential: admin.credential.cert(config.serviceAccount) });
    }
    else
        app = admin.initializeApp();
    const baseURL = "https://exp.host/--/api/v2/push/send";
    return {
        async sendToOne(config) {
            await axios_1.default.post(baseURL, {
                to: config.token,
                title: config.notification.title,
                body: config.notification.body,
                data: config.data,
            });
            await app.messaging().send({
                data: config.data,
                token: config.token,
                notification: config.notification,
            });
        },
        async sendToMany(config) {
            await axios_1.default.post(baseURL, {
                to: config.tokens,
                title: config.notification.title,
                body: config.notification.body,
                data: config.data,
            });
            await app.messaging().sendMulticast({
                data: config.data,
                tokens: config.tokens,
                notification: config.notification,
            });
        },
    };
}
exports.default = firebaseMessaging;
