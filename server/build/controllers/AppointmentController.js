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
const ical_generator_1 = __importStar(require("ical-generator"));
const joi_1 = __importDefault(require("joi"));
const moment_1 = __importDefault(require("moment"));
const rabbitmq_email_manager_1 = require("rabbitmq-email-manager");
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const Appointment_1 = require("../models/Appointment");
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const VehicleFault_1 = __importDefault(require("../models/VehicleFault"));
const Customer_1 = __importDefault(require("../models/Customer"));
const constants_1 = require("../config/constants");
const Generic_1 = __importDefault(require("../utils/Generic"));
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
const email_content_1 = __importDefault(require("../resources/templates/email/email_content"));
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const booking_reschedule_email_1 = __importDefault(require("../resources/templates/email/booking_reschedule_email"));
const booking_cancel_email_1 = __importDefault(require("../resources/templates/email/booking_cancel_email"));
const sequelize_1 = require("sequelize");
const booking_success_email_1 = __importDefault(require("../resources/templates/email/booking_success_email"));
const formidable_1 = __importDefault(require("formidable"));
const CUSTOMER_ID = 'Customer Id';
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
class AppointmentController {
    static LOGGER = AppLogger_1.default.init(AppointmentController.name).logger;
    static async allAppointments() {
        try {
            const appointments = await dao_1.default.appointmentDAOService.findAll({
                include: [
                    { model: Vehicle_1.default },
                    { model: VehicleFault_1.default },
                    {
                        model: Customer_1.default,
                        attributes: { exclude: ['password', 'rawPassword', 'loginToken'] },
                    },
                ],
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: appointments,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async getAppointment(req) {
        const params = req.params;
        const { error, value } = joi_1.default.object({
            appointmentId: joi_1.default.string().required().label(CUSTOMER_ID),
        }).validate(params);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.NOT_FOUND.code));
        }
        try {
            const appointment = await dao_1.default.appointmentDAOService.findById(+value?.appointmentId, {
                include: [{ model: Vehicle_1.default }, { model: VehicleFault_1.default }, { model: Customer_1.default }],
            });
            if (!appointment) {
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
            }
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                result: appointment,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static async createAppointment(req) {
        const { error, value } = joi_1.default.object({
            planCategory: joi_1.default.string(),
            appointmentDate: joi_1.default.string(),
            vehicleFault: joi_1.default.string(),
            vehicleId: joi_1.default.number(),
            customerId: joi_1.default.number(),
            location: joi_1.default.string(),
            reference: joi_1.default.string(),
            subscriptionName: joi_1.default.string(),
            amount: joi_1.default.number(),
            timeSlot: joi_1.default.string(),
        }).validate(req.body);
        if (error) {
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        }
        const planCategory = value.planCategory;
        const appointmentDate = (0, moment_1.default)(value.appointmentDate).utc(true);
        const serviceLocation = value.serviceLocation;
        const vehicleFault = value.vehicleFault;
        const subscriptionName = value.subscriptionName;
        const vehicleId = value.vehicleId;
        const amount = value.amount;
        const customerId = value.customerId;
        const reference = value.reference;
        //construct plan label
        const planLabel = Generic_1.default.generateSlug(`${subscriptionName} ${planCategory}`);
        try {
            /**** Find subscription -> start*****/
            const subscription = await dao_1.default.subscriptionDAOService.findByAny({
                where: {
                    name: subscriptionName,
                },
            });
            if (!subscription) {
                return Promise.reject(CustomAPIError_1.default.response(`Subscription ${subscriptionName} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            /**** Find subscription -> end*****/
            let transaction;
            if (reference) {
                //find customer transaction by reference number
                transaction = await dao_1.default.transactionDAOService.findByAny({
                    where: { reference: reference },
                });
                if (!transaction) {
                    return Promise.reject(CustomAPIError_1.default.response(`Transaction reference ${value.reference} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                }
            }
            //find vehicle by id
            const vehicle = await dao_1.default.vehicleDAOService.findById(vehicleId);
            //if vehicle does not exist, throw error
            if (!vehicle) {
                return Promise.reject(CustomAPIError_1.default.response(`Vehicle does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            const customerData = await dao_1.default.customerDAOService.findById(customerId);
            if (!customerData) {
                return Promise.reject(CustomAPIError_1.default.response(`Customer does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            let message, modeOfService, startDate, endDate;
            const year = appointmentDate.year();
            const month = appointmentDate.month();
            const date = appointmentDate.date();
            //find customer subscription by subscription name and plan category
            const customerSubscription = await dao_1.default.customerSubscriptionDAOService.findByAny({
                where: {
                    [sequelize_1.Op.and]: [{ planType: subscriptionName }, { planCategory }],
                },
                include: [{ model: Customer_1.default, where: { id: customerId } }],
            });
            //If plan is mobile or plan is hybrid and mobile
            if (planCategory === constants_1.MOBILE_CATEGORY || (planCategory === constants_1.HYBRID_CATEGORY && serviceLocation !== constants_1.MAIN_OFFICE)) {
                startDate = appointmentDate;
                endDate = (0, moment_1.default)(appointmentDate).add(constants_1.MOBILE_INSPECTION_TIME, 'hours');
                modeOfService = constants_1.MOBILE_CATEGORY;
                message = `You have successfully booked a ${constants_1.MOBILE_CATEGORY}
         inspection service for ${appointmentDate.format('LLL')}.
         We will confirm this appointment date and revert back to you.
        `;
            }
            else {
                //generate appointment calendar
                const slots = value.timeSlot.split('-'); //9am - 11am
                const startTime = (0, moment_1.default)(slots[0].trim(), 'HH: a'); //9am
                const endTime = (0, moment_1.default)(slots[1].trim(), 'HH: a'); //11am
                startDate = (0, moment_1.default)({ year, month, date, hours: startTime.hours() }); //create start date
                endDate = (0, moment_1.default)({ year, month, date, hours: endTime.hours() }); //create end date
                modeOfService = constants_1.DRIVE_IN_CATEGORY;
                message = `You have successfully booked a ${constants_1.DRIVE_IN_CATEGORY}
        inspection service for ${value.timeSlot},
         ${appointmentDate.format('LL')}`;
            }
            const bookingValues = {
                code: Generic_1.default.generateRandomString(10),
                appointmentDate: appointmentDate,
                timeSlot: value.timeSlot,
                status: constants_1.APPOINTMENT_STATUS.pending,
                serviceLocation,
                planCategory,
                modeOfService,
                programme: constants_1.SERVICES[0].slug,
                serviceCost: amount,
            };
            //book appointment
            const booking = await dao_1.default.appointmentDAOService.create(bookingValues);
            const vehicleFaultValues = {
                description: vehicleFault,
            };
            const _vehicleFault = await dao_1.default.vehicleFaultDAOService.create(vehicleFaultValues);
            await booking.$set('vehicleFault', _vehicleFault);
            //update vehicle details booking status
            vehicle.isBooked = true;
            await vehicle.save();
            //associate booking with vehicle details
            await booking.$set('vehicle', vehicle);
            //associate customer with booking
            await customerData.$add('appointments', [booking]);
            //if this is a plan, then update mode of service of customer subscription
            if (value.subscriptionName !== constants_1.SUBSCRIPTIONS[0].name && customerSubscription) {
                const subscriptionPlan = await subscription.$get('plans', {
                    where: { label: planLabel },
                });
                const defaultMobileInspections = subscriptionPlan[0].mobile;
                const defaultDriveInInspections = subscriptionPlan[0].driveIn;
                let mobileCount = customerSubscription.mobileCount;
                let driveInCount = customerSubscription.driveInCount;
                //Hybrid mobile
                if (planCategory === constants_1.HYBRID_CATEGORY && serviceLocation !== constants_1.MAIN_OFFICE) {
                    if (mobileCount < defaultMobileInspections) {
                        mobileCount++;
                    }
                    else
                        return this.getInspectionsCountError(subscriptionName, constants_1.MOBILE_CATEGORY);
                }
                //Hybrid drive-in
                if (planCategory === constants_1.HYBRID_CATEGORY && serviceLocation === constants_1.MAIN_OFFICE) {
                    if (driveInCount < defaultDriveInInspections) {
                        driveInCount++;
                    }
                    else
                        return this.getInspectionsCountError(subscriptionName, constants_1.DRIVE_IN_CATEGORY);
                }
                //Increment count for normal mobile inspection
                if (planCategory === constants_1.MOBILE_CATEGORY) {
                    if (mobileCount < defaultMobileInspections) {
                        mobileCount++;
                    }
                    else
                        return this.getInspectionsCountError(subscriptionName, constants_1.MOBILE_CATEGORY);
                }
                //increment count for normal drive-in inspection
                if (planCategory === constants_1.DRIVE_IN_CATEGORY) {
                    if (driveInCount < defaultDriveInInspections) {
                        driveInCount++;
                    }
                    else
                        return this.getInspectionsCountError(subscriptionName, constants_1.DRIVE_IN_CATEGORY);
                }
                await customerSubscription.update({
                    mobileCount,
                    driveInCount,
                    inspections: mobileCount + driveInCount,
                });
            }
            if (transaction) {
                await transaction.update({
                    serviceStatus: 'processed',
                    status: 'success',
                    paidAt: transaction.createdAt,
                });
            }
            const eventData = {
                name: 'Vehicle Inspection',
                timezone: 'Africa/Lagos',
                description: `${subscriptionName} Vehicle Inspection`,
                method: ical_generator_1.ICalCalendarMethod.REQUEST,
                events: [
                    {
                        start: startDate,
                        end: endDate,
                        description: `${subscriptionName} Vehicle Inspection`,
                        summary: `You have scheduled for ${subscriptionName} Vehicle Inspection`,
                        organizer: {
                            name: 'Jiffix Technologies',
                            email: process.env.SMTP_EMAIL_FROM,
                        },
                    },
                ],
            };
            const eventCalendar = (0, ical_generator_1.default)(eventData).toString();
            const mailText = (0, booking_success_email_1.default)({
                planCategory: planCategory,
                location: serviceLocation,
                appointmentDate: appointmentDate.format('LL'),
                loginUrl: process.env.CUSTOMER_APP_HOST,
                vehicleFault: vehicleFault,
                vehicleDetail: {
                    year: vehicle.modelYear,
                    make: vehicle.make,
                    model: vehicle.model,
                },
            });
            //generate mail template
            const mailHtml = (0, email_content_1.default)({
                firstName: customerData.firstName,
                signature: process.env.SMTP_EMAIL_SIGNATURE,
                text: mailText,
            });
            //send email
            await rabbitmq_email_manager_1.QueueManager.publish({
                data: {
                    to: customerData.email,
                    from: {
                        name: process.env.SMTP_EMAIL_FROM_NAME,
                        address: process.env.SMTP_EMAIL_FROM,
                    },
                    subject: 'Jiffix Appointment Confirmation',
                    bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                    html: mailHtml,
                    icalEvent: {
                        method: 'request',
                        content: eventCalendar,
                        filename: 'invite.ics',
                    },
                },
            });
            AppEventEmitter_1.appEventEmitter.emit(constants_1.BOOK_APPOINTMENT, { appointment: booking });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                result: message,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async updateAppointment(req) {
        const appointmentId = req.params.appointmentId;
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                try {
                    const appointment = await dao_1.default.appointmentDAOService.findById(+appointmentId, {
                        include: [
                            { model: Vehicle_1.default },
                            { model: VehicleFault_1.default },
                            {
                                model: Customer_1.default,
                                attributes: {
                                    exclude: ['password', 'rawPassword', 'loginToken'],
                                },
                            },
                        ],
                    });
                    if (!appointment) {
                        return reject(CustomAPIError_1.default.response(HttpStatus_1.default.NOT_FOUND.value, HttpStatus_1.default.NOT_FOUND.code));
                    }
                    const basePath = `${constants_1.UPLOAD_BASE_PATH}/docs`;
                    if (undefined === fields || undefined === files) {
                        return reject(CustomAPIError_1.default.response(HttpStatus_1.default.INTERNAL_SERVER_ERROR.value, HttpStatus_1.default.INTERNAL_SERVER_ERROR.code));
                    }
                    const inventory = files.inventory;
                    const report = files.report;
                    const estimate = files.estimate;
                    const status = fields.status;
                    if (inventory) {
                        appointment.set({
                            inventoryFile: await Generic_1.default.getImagePath({
                                tempPath: inventory.filepath,
                                filename: inventory.originalFilename,
                                basePath,
                            }),
                        });
                    }
                    if (report) {
                        appointment.set({
                            reportFile: await Generic_1.default.getImagePath({
                                tempPath: report.filepath,
                                filename: report.originalFilename,
                                basePath,
                            }),
                        });
                    }
                    if (estimate) {
                        appointment.set({
                            estimateFile: await Generic_1.default.getImagePath({
                                tempPath: estimate.filepath,
                                filename: estimate.originalFilename,
                                basePath,
                            }),
                        });
                    }
                    if (status)
                        appointment.set({ status });
                    await appointment.save();
                    resolve({
                        message: HttpStatus_1.default.OK.value,
                        code: HttpStatus_1.default.OK.code,
                        result: appointment,
                    });
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    }
    static async rescheduleInspection(req) {
        try {
            //validate request body
            const { error, value } = joi_1.default.object(Appointment_1.$rescheduleInspectionSchema).validate(req.body);
            if (error) {
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            }
            const id = req.params?.appointmentId;
            const customerId = value?.customerId;
            const customer = await dao_1.default.customerDAOService.findById(customerId);
            if (!customer) {
                return Promise.reject(CustomAPIError_1.default.response(`Customer with Id: ${id} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            //find appointment by id
            const appointment = await dao_1.default.appointmentDAOService.findById(+id, {
                include: [VehicleFault_1.default, Vehicle_1.default],
            });
            if (!appointment) {
                return Promise.reject(CustomAPIError_1.default.response(`Appointment with Id: ${id} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            const planCategory = value.planCategory;
            const serviceLocation = value.location;
            const vehicleFault = value.vehicleFault;
            const timeSlot = value.timeSlot;
            const appointmentDate = (0, moment_1.default)(value.time).utc(true);
            const vehicle = await appointment.vehicle;
            const _vehicleFault = appointment.vehicleFault;
            await _vehicleFault.update({
                description: vehicleFault,
            });
            //If appointment date is 1 hour away, do not allow reschedule
            const now = (0, moment_1.default)();
            if (appointmentDate.diff(now) === constants_1.RESCHEDULE_CONSTRAINT) {
                return Promise.reject(CustomAPIError_1.default.response('Sorry you cannot reschedule 1 hour to inspection', HttpStatus_1.default.BAD_REQUEST.code));
            }
            let message, modeOfService, startDate, endDate;
            const year = appointmentDate.year();
            const month = appointmentDate.month();
            const date = appointmentDate.date();
            //If plan is mobile or plan is hybrid and mobile
            if (planCategory === constants_1.MOBILE_CATEGORY || (planCategory === constants_1.HYBRID_CATEGORY && serviceLocation !== constants_1.MAIN_OFFICE)) {
                startDate = appointmentDate;
                endDate = (0, moment_1.default)(appointmentDate).add(constants_1.MOBILE_INSPECTION_TIME, 'hours');
                modeOfService = constants_1.MOBILE_CATEGORY;
                message = `You have successfully rescheduled your ${constants_1.MOBILE_CATEGORY}
         inspection service for ${appointmentDate.format('LLL')}.
         We will confirm this appointment date and revert back to you.
        `;
            }
            else {
                //generate appointment calendar
                const slots = timeSlot.split('-'); //9am - 11am
                const startTime = (0, moment_1.default)(slots[0].trim(), 'HH: a'); //9am
                const endTime = (0, moment_1.default)(slots[1].trim(), 'HH: a'); //11am
                startDate = (0, moment_1.default)({ year, month, date, hours: startTime.hours() }); //create start date
                endDate = (0, moment_1.default)({ year, month, date, hours: endTime.hours() }); //create end date
                modeOfService = constants_1.DRIVE_IN_CATEGORY;
                message = `You have successfully rescheduled
             your ${constants_1.DRIVE_IN_CATEGORY} inspection service for 
             ${timeSlot}, ${appointmentDate.format('LL')}`;
            }
            const appointments = await dao_1.default.appointmentDAOService.findAll();
            //check whether the appointment date coincides with other appointment dates
            for (let i = 0; i < appointments.length; i++) {
                const currDate = (0, moment_1.default)(appointments[i].appointmentDate);
                if (currDate === appointmentDate) {
                    return Promise.reject(CustomAPIError_1.default.response(`New date ${appointmentDate.format('LLL')} is already taken. Choose another date and time`, HttpStatus_1.default.BAD_REQUEST.code));
                }
            }
            const subscription = await dao_1.default.customerSubscriptionDAOService.findByAny({
                where: { id: vehicle?.customerSubscriptionId },
            });
            //If this is a subscribed plan && hybrid mode of service
            if (subscription && subscription.isHybrid) {
                //Mobile service mode
                await this.mutateMobileServiceModeAfterReschedule(serviceLocation, subscription, appointment);
                //Drive in service mode
                this.mutateDriveInModeCountsAfterReschedule(serviceLocation, subscription);
                await subscription.save();
            }
            // Release disabled time slot for previous appointment and save the new time slot
            if (appointment.planCategory === constants_1.DRIVE_IN_CATEGORY) {
                await Generic_1.default.enableTimeSlot(appointmentDate, appointment);
                //update appointment time slot
                await appointment.update({ timeSlot });
            }
            //update appointment date
            await appointment.update({
                appointmentDate: appointmentDate.toDate(),
                planCategory,
                serviceLocation,
                modeOfService,
                timeSlot,
            });
            const calendarData = {
                name: '(Reschedule) Vehicle Inspection',
                timezone: 'Africa/Lagos',
                description: `(Reschedule) Vehicle Inspection`,
                method: ical_generator_1.ICalCalendarMethod.REQUEST,
                url: 'https://www.jiffixtech.com',
                events: [
                    {
                        start: startDate,
                        end: endDate,
                        description: `(Reschedule) Vehicle Inspection`,
                        summary: `(Reschedule) Vehicle Inspection`,
                        organizer: {
                            name: 'Jiffix Technologies',
                            email: process.env.SMTP_EMAIL_FROM,
                        },
                    },
                ],
            };
            const eventCalendar = (0, ical_generator_1.default)(calendarData).toString();
            const mailText = (0, booking_reschedule_email_1.default)({
                planCategory: planCategory,
                location: serviceLocation,
                appointmentDate: appointmentDate.format('LL'),
                loginUrl: process.env.CUSTOMER_APP_HOST,
                vehicleFault: vehicleFault,
                vehicleDetail: {
                    year: vehicle.modelYear,
                    make: vehicle.make,
                    model: vehicle.model,
                },
            });
            //generate mail template
            const mailHtml = (0, email_content_1.default)({
                firstName: customer.firstName,
                signature: process.env.SMTP_EMAIL_SIGNATURE,
                text: mailText,
            });
            //send email
            await rabbitmq_email_manager_1.QueueManager.publish({
                data: {
                    to: customer.email,
                    from: {
                        name: process.env.SMTP_EMAIL_FROM_NAME,
                        address: process.env.SMTP_EMAIL_FROM,
                    },
                    subject: 'Vehicle Appointment Reschedule Confirmation',
                    bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                    html: mailHtml,
                    icalEvent: {
                        method: 'request',
                        content: eventCalendar,
                        filename: 'invite.ics',
                    },
                },
            });
            AppEventEmitter_1.appEventEmitter.emit(constants_1.RESCHEDULE_APPOINTMENT, {
                appointment,
                customer,
                user: req.user,
            });
            return Promise.resolve({
                message,
                code: HttpStatus_1.default.OK.code,
            });
        }
        catch (e) {
            this.LOGGER.error(e);
            return Promise.reject(e);
        }
    }
    static async cancelInspection(req) {
        try {
            //validate request body
            const { error, value } = joi_1.default.object(Appointment_1.$cancelInspectionSchema).validate(req.body);
            if (error) {
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            }
            const id = req.params?.appointmentId;
            const customerId = value?.customerId;
            const customer = await dao_1.default.customerDAOService.findById(customerId);
            if (!customer) {
                return Promise.reject(CustomAPIError_1.default.response(`Customer with Id: ${id} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            }
            //find appointment by id
            const appointment = await dao_1.default.appointmentDAOService.findById(+id, {
                include: [Vehicle_1.default, VehicleFault_1.default],
            });
            if (!appointment) {
                return Promise.reject(CustomAPIError_1.default.response(`Appointment with Id: ${id} does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
            }
            const planCategory = appointment.planCategory;
            const serviceLocation = appointment.serviceLocation;
            const vehicleFault = appointment.vehicleFault.description;
            const appointmentDate = (0, moment_1.default)(appointment.appointmentDate).utc(true);
            const vehicle = appointment.vehicle;
            const subscription = await dao_1.default.customerSubscriptionDAOService.findByAny({
                where: { id: vehicle.customerSubscriptionId },
            });
            if (appointment.planCategory === constants_1.DRIVE_IN_CATEGORY) {
                await Generic_1.default.enableTimeSlot(appointmentDate, appointment);
            }
            //If this is a subscribed plan
            if (subscription) {
                await this.mutatePlanCountsAfterCancel(subscription, serviceLocation);
            }
            //update vehicle status
            await vehicle.update({
                isBooked: false,
            });
            //update appointment
            await appointment.update({
                status: constants_1.APPOINTMENT_STATUS.cancel,
            });
            const mailText = (0, booking_cancel_email_1.default)({
                planCategory: planCategory,
                location: serviceLocation,
                appointmentDate: appointmentDate.format('LL'),
                loginUrl: process.env.CUSTOMER_APP_HOST,
                vehicleFault: vehicleFault,
                vehicleDetail: {
                    year: vehicle.modelYear,
                    make: vehicle.make,
                    model: vehicle.model,
                },
            });
            //generate mail template
            const mailHtml = (0, email_content_1.default)({
                firstName: customer.firstName,
                signature: process.env.SMTP_EMAIL_SIGNATURE,
                text: mailText,
            });
            //send email
            await rabbitmq_email_manager_1.QueueManager.publish({
                data: {
                    to: customer.email,
                    from: {
                        name: process.env.SMTP_EMAIL_FROM_NAME,
                        address: process.env.SMTP_EMAIL_FROM,
                    },
                    subject: 'Vehicle Appointment Cancellation Confirmation',
                    bcc: [process.env.SMTP_CUSTOMER_CARE_EMAIL, process.env.SMTP_EMAIL_FROM],
                    html: mailHtml,
                },
            });
            AppEventEmitter_1.appEventEmitter.emit(constants_1.CANCEL_APPOINTMENT, {
                appointment,
            });
            return Promise.resolve({
                message: `You successfully cancelled your vehicle appointment.`,
                code: HttpStatus_1.default.OK.code,
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async mutatePlanCountsAfterCancel(subscription, serviceLocation) {
        //handle for hybrid mode of service
        if (subscription.isHybrid) {
            //mobile service mode
            if (serviceLocation !== constants_1.MAIN_OFFICE)
                subscription.mobileCount -= 1;
            //drive in service mode
            if (serviceLocation === constants_1.MAIN_OFFICE)
                subscription.driveInCount -= 1;
        }
        else {
            if (subscription.planCategory === constants_1.MOBILE_CATEGORY)
                subscription.mobileCount -= 1;
            if (subscription.planCategory === constants_1.DRIVE_IN_CATEGORY)
                subscription.driveInCount -= 1;
        }
        subscription.inspections -= 1; //decrement total inspections
        await subscription.save();
    }
    static mutateDriveInModeCountsAfterReschedule(serviceLocation, subscription) {
        //Only update drive in count if it is less than 1
        if (serviceLocation === constants_1.MAIN_OFFICE && subscription.driveInCount < 1) {
            subscription.driveInCount += 1;
            subscription.mobileCount -= 1;
        }
    }
    static async mutateMobileServiceModeAfterReschedule(serviceLocation, subscription, appointment) {
        //Only update mobile count if it is less than 1
        if (serviceLocation !== constants_1.MAIN_OFFICE && subscription.mobileCount < 1) {
            subscription.mobileCount += 1;
            subscription.driveInCount -= 1;
            //Enable disabled time slot since we are now on mobile service mode
            const appointmentDate = (0, moment_1.default)(appointment.appointmentDate);
            await Generic_1.default.enableTimeSlot(appointmentDate, appointment);
        }
    }
    static getInspectionsCountError(subscriptionName, category) {
        return Promise.reject(CustomAPIError_1.default.response(`Maximum number of ${category} inspections reached for plan ${subscriptionName}`, HttpStatus_1.default.BAD_REQUEST.code));
    }
}
exports.default = AppointmentController;
