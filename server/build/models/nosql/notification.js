"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
    to: mongoose_1.default.SchemaTypes.Mixed,
    subject: mongoose_1.default.SchemaTypes.String,
    type: mongoose_1.default.SchemaTypes.String,
    message: mongoose_1.default.SchemaTypes.Mixed,
    from: mongoose_1.default.SchemaTypes.String,
    seen: mongoose_1.default.SchemaTypes.Boolean,
}, { collection: 'notifications', timestamps: true });
exports.NotificationModel = mongoose_1.default.model('Notification', Schema);
