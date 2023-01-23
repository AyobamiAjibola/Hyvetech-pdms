"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function firebaseMessaging(config) {
    // let app: ReturnType<() => App>;
    // if (config && config.serviceAccount) {
    //   app = admin.initializeApp({ credential: admin.credential.cert(config.serviceAccount) });
    // } else app = admin.initializeApp();
    const baseURL = "https://exp.host/--/api/v2/push/send";
    return {
        async sendToOne(config) {
            await axios_1.default.post(baseURL, {
                to: config.token,
                title: config.notification.title,
                body: config.notification.body,
                data: config.data,
            });
            // await app.messaging().send({
            //   data: config.data,
            //   token: config.token,
            //   notification: config.notification,
            // });
        },
        async sendToMany(config) {
            await axios_1.default.post(baseURL, {
                to: config.tokens,
                title: config.notification.title,
                body: config.notification.body,
                data: config.data,
            });
            // await app.messaging().sendMulticast({
            //   data: config.data,
            //   tokens: config.tokens,
            //   notification: config.notification,
            // });
        },
    };
}
exports.default = firebaseMessaging;
