"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const dao_1 = __importDefault(require("../services/dao"));
const AppEventEmitter_1 = require("./AppEventEmitter");
const constants_1 = require("../config/constants");
const notification_1 = require("../models/nosql/notification");
const sequelize_1 = require("sequelize");
const axios_1 = __importDefault(require("axios"));
// import * as AxiosMain from 'axios';
// import fetch from 'node-fetch';
const PushNotificationService_1 = __importDefault(require("./PushNotificationService"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const fetch = require("node-fetch");
function eventManager(io) {
    try {
        AppEventEmitter_1.appEventEmitter.on(constants_1.RESCHEDULE_APPOINTMENT, (props) => {
            const { appointment, customer, user } = props;
            (async () => {
                const notification = await notification_1.NotificationModel.create({
                    seen: false,
                    from: `${user.firstName} ${user.lastName}`,
                    to: customer.id,
                    type: 'Appointment',
                    subject: 'Inspection Reschedule',
                    message: {
                        appointmentId: appointment.id,
                        text: `Your ${appointment.modeOfService} 
              inspection service has been rescheduled to 
              ${appointment.timeSlot},
              ${(0, moment_1.default)(appointment.appointmentDate).format('LL')}.`,
                    },
                });
                io.emit(constants_1.RESCHEDULE_APPOINTMENT, {
                    notification,
                });
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.ASSIGN_DRIVER_JOB, (props) => {
            const { techId, partner } = props;
            (async () => {
                const technician = await dao_1.default.technicianDAOService.findById(techId);
                if (!technician)
                    throw new Error(`Technician with Id: ${techId} does not exist`);
                const notification = await notification_1.NotificationModel.create({
                    seen: false,
                    from: `${partner.name}`,
                    to: techId,
                    type: 'Job',
                    subject: 'Vehicle Inspection',
                    message: `New Job Assigned`,
                });
                io.to(technician.eventId).emit(constants_1.ASSIGN_DRIVER_JOB, {
                    notification: notification.toJSON({ flattenMaps: true }),
                });
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.APPROVE_JOB, (props) => {
            axios_1.default.defaults.baseURL = process.env.GOOGLE_FCM_HOST;
            axios_1.default.defaults.headers.post['Content-Type'] = 'application/json';
            axios_1.default.defaults.headers.common['Authorization'] = `key=${process.env.AUTOHYVE_FCM_SERVER_KEY}`;
            const { job } = props;
            (async () => {
                const [firstName, lastName] = job.vehicleOwner.split(' ');
                let eventId = '';
                let id = 0;
                const customer = await dao_1.default.customerDAOService.findByAny({
                    where: {
                        [sequelize_1.Op.and]: [{ firstName }, { lastName }],
                    },
                });
                const driver = await dao_1.default.rideShareDriverDAOService.findByAny({
                    where: {
                        [sequelize_1.Op.and]: [{ firstName }, { lastName }],
                    },
                });
                if (driver) {
                    eventId = driver.pushToken;
                    id = driver.id;
                }
                if (customer) {
                    eventId = customer.pushToken;
                    id = customer.id;
                }
                const notification = {
                    seen: false,
                    from: `${job.partner.name}`,
                    to: id,
                    type: 'Job',
                    subject: 'Approved Job',
                    message: `Job on your vehicle ${job.vehicle.make} ${job.vehicle.model} has been approved`,
                };
                await notification_1.NotificationModel.create(notification);
                if (eventId.length) {
                    io.to(eventId).emit(constants_1.APPROVE_JOB, { notification });
                }
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.CREATED_ESTIMATE, (props) => {
            const { estimate, customer, partner, vehicle } = props;
            const partnerContact = partner.contact.address;
            (async () => {
                try {
                    const notification = {
                        seen: false,
                        from: `${partner.name} ${partnerContact}`,
                        to: `${customer.id}`,
                        type: 'Estimate',
                        subject: `Estimate for your vehicle ${vehicle.make} ${vehicle.model} has been created`,
                        message: `${estimate.id}`,
                    };
                    await notification_1.NotificationModel.create(notification);
                    const whichPushToken = Generic_1.default.whichPushToken(customer.pushToken);
                    // const whichPushToken = (customer.pushToken);
                    const title = `${partner.name} Estimate`;
                    const message = `Estimate for your vehicle ${vehicle.make} ${vehicle.model} has been created`;
                    io.to(customer.eventId).emit(constants_1.CREATED_ESTIMATE, { title, message });
                    if (whichPushToken.type === 'android') {
                        const fcm = PushNotificationService_1.default.fcmMessaging.config({
                            baseURL: process.env.GOOGLE_FCM_HOST,
                            experienceId: `@jiffixproductmanager/${customer.expoSlug}`,
                            scopeKey: `@jiffixproductmanager/${customer.expoSlug}`,
                            serverKey: process.env.AUTOHYVE_FCM_SERVER_KEY,
                            pushToken: whichPushToken.token,
                        });
                        const response = await fcm.sendToOne({
                            title,
                            message,
                            sound: true,
                            vibrate: true,
                            priority: 'max',
                        });
                        console.log(response.data);
                    }
                    if (whichPushToken.type === 'ios') {
                        const appleKey = process.env.APPLE_KEY;
                        const appleKeyId = process.env.APPLE_KEY_ID;
                        const appleTeamId = process.env.APPLE_TEAM_ID;
                        const apns = PushNotificationService_1.default.apnMessaging.config({
                            production: true,
                            pushToken: whichPushToken.token,
                            token: { key: appleKey, keyId: appleKeyId, teamId: appleTeamId },
                            topic: 'com.jiffixproductmanager.autohyve',
                        });
                        const responses = await apns.sendToOne({
                            alert: title,
                            payload: { message },
                        });
                        if (responses.failed.length) {
                            const final = await apns.sendToOne({
                                alert: title,
                                payload: { message },
                            });
                            console.log(final.failed);
                        }
                        else
                            console.log(responses.sent);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.TXN_CANCELLED, args => {
            io.emit(constants_1.TXN_CANCELLED, args);
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.TXN_REFERENCE, args => {
            io.emit(constants_1.TXN_REFERENCE, args);
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.INIT_TRANSACTION, (props) => {
            const { customer, response } = props;
            (async () => {
                const notification = await notification_1.NotificationModel.create({
                    seen: false,
                    from: `System`,
                    to: customer.id,
                    type: 'Transaction',
                    subject: 'Transaction Initialized',
                    message: response,
                });
                io.to(customer.eventId).emit(constants_1.INIT_TRANSACTION, {
                    notification: notification.toJSON({ flattenMaps: true }),
                });
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.VERIFY_TRANSACTION, (props) => {
            const { customer, transaction } = props;
            (async () => {
                const notification = await notification_1.NotificationModel.create({
                    seen: false,
                    from: `System`,
                    to: customer.id,
                    type: 'Transaction',
                    subject: 'Transaction Verified',
                    message: transaction,
                });
                io.to(customer.eventId).emit(constants_1.VERIFY_TRANSACTION, {
                    notification: notification.toJSON({ flattenMaps: true }),
                });
            })();
        });
        AppEventEmitter_1.appEventEmitter.on(constants_1.UPDATE_INVOICE, (props) => {
            const { customer } = props;
            io.to(customer.eventId).emit(constants_1.UPDATE_INVOICE);
        });
    }
    catch (e) {
        throw new Error(e);
    }
}
exports.default = eventManager;
