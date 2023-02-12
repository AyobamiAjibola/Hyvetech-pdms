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
const axios_1 = __importDefault(require("axios"));
const apn = __importStar(require("apn"));
class FCM {
    experienceId;
    scopeKey;
    baseURL;
    serverKey;
    pushToken;
    constructor(fcmConfig) {
        axios_1.default.defaults.baseURL = fcmConfig.baseURL;
        axios_1.default.defaults.headers.post['Content-Type'] = 'application/json';
        axios_1.default.defaults.headers.common['Authorization'] = `key=${fcmConfig.serverKey}`;
        this.experienceId = fcmConfig.experienceId;
        this.scopeKey = fcmConfig.scopeKey;
        this.baseURL = fcmConfig.baseURL;
        this.serverKey = fcmConfig.serverKey;
        this.pushToken = fcmConfig.pushToken;
    }
    static config(fcmConfig) {
        return new FCM(fcmConfig);
    }
    async sendToOne(firebaseData) {
        const payload = JSON.stringify({
            to: this.pushToken,
            priority: 'normal',
            data: {
                experienceId: this.experienceId,
                scopeKey: this.scopeKey,
                ...firebaseData,
            },
        });
        return await axios_1.default.post('/send', payload);
    }
}
class APNS {
    apnProvider;
    pushToken;
    topic;
    constructor(apnsConfig) {
        this.pushToken = apnsConfig.pushToken;
        this.topic = apnsConfig.topic;
        this.apnProvider = new apn.Provider(apnsConfig);
    }
    static config(apnsConfig) {
        return new APNS(apnsConfig);
    }
    async sendToOne(apnsData) {
        const { priority = 1, sound = 'ping.aiff', badge = 3 } = apnsData;
        const notification = new apn.Notification();
        notification.topic = this.topic;
        notification.priority = priority;
        notification.sound = sound;
        notification.badge = badge;
        Object.assign(notification, apnsData);
        return this.apnProvider.send(notification, this.pushToken);
    }
}
const PushNotificationService = {
    fcmMessaging: FCM,
    apnMessaging: APNS,
};
exports.default = PushNotificationService;
