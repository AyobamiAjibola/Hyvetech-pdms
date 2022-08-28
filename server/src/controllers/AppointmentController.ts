import { Request } from "express";

import ical, { ICalCalendarData, ICalCalendarMethod } from "ical-generator";
import Joi from "joi";
import moment from "moment";
import { QueueManager } from "rabbitmq-email-manager";

import { appCommonTypes } from "../@types/app-common";
import HttpStatus from "../helpers/HttpStatus";
import dataSources from "../services/dao";
import Appointment, {
  $cancelInspectionSchema,
  $rescheduleInspectionSchema,
} from "../models/Appointment";

import CustomAPIError from "../exceptions/CustomAPIError";
import Vehicle from "../models/Vehicle";
import VehicleFault from "../models/VehicleFault";
import Customer from "../models/Customer";
import {
  APPOINTMENT_STATUS,
  CANCEL_APPOINTMENT,
  DRIVE_IN_CATEGORY,
  HYBRID_CATEGORY,
  MAIN_OFFICE,
  MOBILE_CATEGORY,
  MOBILE_INSPECTION_TIME,
  RESCHEDULE_APPOINTMENT,
  RESCHEDULE_CONSTRAINT,
  UPLOAD_BASE_PATH,
} from "../config/constants";

import Generic from "../utils/Generic";
import AppLogger from "../utils/AppLogger";
import email_content from "../resources/templates/email/email_content";
import { appEventEmitter } from "../services/AppEventEmitter";
import booking_reschedule_email from "../resources/templates/email/booking_reschedule_email";
import CustomerSubscription from "../models/CustomerSubscription";
import booking_cancel_email from "../resources/templates/email/booking_cancel_email";
import HttpResponse = appCommonTypes.HttpResponse;
import AppRequestParams = appCommonTypes.AppRequestParams;

const CUSTOMER_ID = "Customer Id";

export default class AppointmentController {
  private static LOGGER = AppLogger.init(AppointmentController.name).logger;

  public static async allAppointments() {
    try {
      const appointments = await dataSources.appointmentDAOService.findAll({
        include: [
          { model: Vehicle },
          { model: VehicleFault },
          {
            model: Customer,
            attributes: { exclude: ["password", "rawPassword", "loginToken"] },
          },
        ],
      });

      const response: HttpResponse<Appointment> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: appointments,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async getAppointment(req: Request) {
    const params = req.params as AppRequestParams;

    const { error, value } = Joi.object<AppRequestParams>({
      appointmentId: Joi.string().required().label(CUSTOMER_ID),
    }).validate(params);

    if (error) {
      return Promise.reject(
        CustomAPIError.response(
          error.details[0].message,
          HttpStatus.NOT_FOUND.code
        )
      );
    }

    try {
      const appointment = await dataSources.appointmentDAOService.findById(
        +value?.appointmentId,
        {
          include: [
            { model: Vehicle },
            { model: VehicleFault },
            { model: Customer },
          ],
        }
      );

      if (!appointment) {
        return Promise.reject(
          CustomAPIError.response(
            HttpStatus.NOT_FOUND.value,
            HttpStatus.NOT_FOUND.code
          )
        );
      }

      const response: HttpResponse<Appointment> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: appointment,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async updateAppointment(req: Request) {
    const appointmentId = req.params.appointmentId as string;

    const appointment = await dataSources.appointmentDAOService.findById(
      +appointmentId,
      {
        include: [
          { model: Vehicle },
          { model: VehicleFault },
          {
            model: Customer,
            attributes: { exclude: ["password", "rawPassword", "loginToken"] },
          },
        ],
      }
    );

    if (!appointment) {
      return Promise.reject(
        CustomAPIError.response(
          HttpStatus.NOT_FOUND.value,
          HttpStatus.NOT_FOUND.code
        )
      );
    }

    const basePath = `${UPLOAD_BASE_PATH}/docs`;

    if (undefined === req.fields || undefined === req.files) {
      return Promise.reject(
        CustomAPIError.response(
          HttpStatus.INTERNAL_SERVER_ERROR.value,
          HttpStatus.INTERNAL_SERVER_ERROR.code
        )
      );
    }

    const inventory = req.files.inventory as { [p: string]: any };
    const report = req.files.report as { [p: string]: any };
    const estimate = req.files.estimate as { [p: string]: any };
    const status = req.fields.status as string;

    if (inventory) {
      appointment.set({
        inventoryFile: await Generic.getImagePath({
          tempPath: inventory.filepath,
          filename: inventory.originalFilename,
          basePath,
        }),
      });
    }

    if (report) {
      appointment.set({
        reportFile: await Generic.getImagePath({
          tempPath: report.filepath,
          filename: report.originalFilename,
          basePath,
        }),
      });
    }

    if (estimate) {
      appointment.set({
        estimateFile: await Generic.getImagePath({
          tempPath: estimate.filepath,
          filename: estimate.originalFilename,
          basePath,
        }),
      });
    }

    if (status) appointment.set({ status });

    await appointment.save();

    return Promise.resolve({
      message: HttpStatus.OK.value,
      code: HttpStatus.OK.code,
      result: appointment,
    } as HttpResponse<Appointment>);
  }

  public static async rescheduleInspection(req: Request) {
    try {
      //validate request body
      const { error, value } = Joi.object($rescheduleInspectionSchema).validate(
        req.body
      );

      if (error) {
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

      const id = req.params?.appointmentId as string;
      const customerId = value?.customerId;

      const customer = await dataSources.customerDAOService.findById(
        customerId
      );

      if (!customer) {
        return Promise.reject(
          CustomAPIError.response(
            `Customer with Id: ${id} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );
      }

      //find appointment by id
      const appointment = await dataSources.appointmentDAOService.findById(
        +id,
        {
          include: [VehicleFault, Vehicle],
        }
      );

      if (!appointment) {
        return Promise.reject(
          CustomAPIError.response(
            `Appointment with Id: ${id} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );
      }

      const planCategory = value.planCategory;
      const serviceLocation = value.location;
      const vehicleFault = value.vehicleFault;
      const timeSlot = value.timeSlot;
      const appointmentDate = moment(value.time).utc(true);
      const vehicle = await appointment.vehicle;

      const _vehicleFault = appointment.vehicleFault;

      await _vehicleFault.update({
        description: vehicleFault,
      });

      //If appointment date is 1 hour away, do not allow reschedule
      const now = moment();
      if (appointmentDate.diff(now) === RESCHEDULE_CONSTRAINT) {
        return Promise.reject(
          CustomAPIError.response(
            "Sorry you cannot reschedule 1 hour to inspection",
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

      let message, modeOfService, startDate, endDate;

      const year = appointmentDate.year();
      const month = appointmentDate.month();
      const date = appointmentDate.date();

      //If plan is mobile or plan is hybrid and mobile
      if (
        planCategory === MOBILE_CATEGORY ||
        (planCategory === HYBRID_CATEGORY && serviceLocation !== MAIN_OFFICE)
      ) {
        startDate = appointmentDate;

        endDate = moment(appointmentDate).add(MOBILE_INSPECTION_TIME, "hours");

        modeOfService = MOBILE_CATEGORY;

        message = `You have successfully rescheduled your ${MOBILE_CATEGORY}
         inspection service for ${appointmentDate.format("LLL")}.
         We will confirm this appointment date and revert back to you.
        `;
      } else {
        //generate appointment calendar
        const slots = timeSlot.split("-"); //9am - 11am
        const startTime = moment(slots[0].trim(), "HH: a"); //9am
        const endTime = moment(slots[1].trim(), "HH: a"); //11am

        startDate = moment({ year, month, date, hours: startTime.hours() }); //create start date
        endDate = moment({ year, month, date, hours: endTime.hours() }); //create end date

        modeOfService = DRIVE_IN_CATEGORY;

        message = `You have successfully rescheduled
             your ${DRIVE_IN_CATEGORY} inspection service for 
             ${timeSlot}, ${appointmentDate.format("LL")}`;
      }

      const appointments = await dataSources.appointmentDAOService.findAll();

      //check whether the appointment date coincides with other appointment dates
      for (let i = 0; i < appointments.length; i++) {
        const currDate = moment(appointments[i].appointmentDate);

        if (currDate === appointmentDate) {
          return Promise.reject(
            CustomAPIError.response(
              `New date ${appointmentDate.format(
                "LLL"
              )} is already taken. Choose another date and time`,
              HttpStatus.BAD_REQUEST.code
            )
          );
        }
      }

      const subscription =
        await dataSources.customerSubscriptionDAOService.findByAny({
          where: { id: vehicle?.customerSubscriptionId },
        });

      //If this is a subscribed plan && hybrid mode of service
      if (subscription && subscription.isHybrid) {
        //Mobile service mode
        await this.mutateMobileServiceModeAfterReschedule(
          serviceLocation,
          subscription,
          appointment
        );

        //Drive in service mode
        this.mutateDriveInModeCountsAfterReschedule(
          serviceLocation,
          subscription
        );

        await subscription.save();
      }

      // Release disabled time slot for previous appointment and save the new time slot
      if (appointment.planCategory === DRIVE_IN_CATEGORY) {
        await Generic.enableTimeSlot(appointmentDate, appointment);

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

      const calendarData: ICalCalendarData = {
        name: "(Reschedule) Vehicle Inspection",
        timezone: "Africa/Lagos",
        description: `(Reschedule) Vehicle Inspection`,
        method: ICalCalendarMethod.REQUEST,
        url: "https://www.jiffixtech.com",
        events: [
          {
            start: startDate,
            end: endDate,
            description: `(Reschedule) Vehicle Inspection`,
            summary: `(Reschedule) Vehicle Inspection`,
            organizer: {
              name: "Jiffix Technologies",
              email: <string>process.env.SMTP_EMAIL_FROM,
            },
          },
        ],
      };

      const eventCalendar = ical(calendarData).toString();

      const mailText = booking_reschedule_email({
        planCategory: planCategory,
        location: serviceLocation,
        appointmentDate: appointmentDate.format("LL"),
        loginUrl: process.env.CUSTOMER_APP_HOST,
        vehicleFault: vehicleFault,
        vehicleDetail: {
          year: vehicle.modelYear,
          make: vehicle.make,
          model: vehicle.model,
        },
      });

      //generate mail template
      const mailHtml = email_content({
        firstName: customer.firstName,
        signature: process.env.SMTP_EMAIL_SIGNATURE,
        text: mailText,
      });

      //send email
      await QueueManager.publish({
        data: {
          to: customer.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: "Vehicle Appointment Reschedule Confirmation",
          bcc: [
            <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
            <string>process.env.SMTP_EMAIL_FROM,
          ],
          html: mailHtml,
          icalEvent: {
            method: "request",
            content: eventCalendar,
            filename: "invite.ics",
          },
        },
      });

      appEventEmitter.emit(RESCHEDULE_APPOINTMENT, {
        appointment,
      });

      return Promise.resolve({
        message,
        code: HttpStatus.OK.code,
      } as HttpResponse<string>);
    } catch (e) {
      this.LOGGER.error(e);
      return Promise.reject(e);
    }
  }

  public static async cancelInspection(req: Request) {
    try {
      //validate request body
      const { error, value } = Joi.object($cancelInspectionSchema).validate(
        req.body
      );

      if (error) {
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

      const id = req.params?.appointmentId as string;
      const customerId = value?.customerId;

      const customer = await dataSources.customerDAOService.findById(
        customerId
      );

      if (!customer) {
        return Promise.reject(
          CustomAPIError.response(
            `Customer with Id: ${id} does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );
      }

      //find appointment by id
      const appointment = await dataSources.appointmentDAOService.findById(
        +id,
        {
          include: [Vehicle, VehicleFault],
        }
      );

      if (!appointment) {
        return Promise.reject(
          CustomAPIError.response(
            `Appointment with Id: ${id} does not exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );
      }

      const planCategory = appointment.planCategory;
      const serviceLocation = appointment.serviceLocation;
      const vehicleFault = appointment.vehicleFault.description;
      const appointmentDate = moment(appointment.appointmentDate).utc(true);
      const vehicle = appointment.vehicle;

      const subscription =
        await dataSources.customerSubscriptionDAOService.findByAny({
          where: { id: vehicle.customerSubscriptionId },
        });

      if (appointment.planCategory === DRIVE_IN_CATEGORY) {
        await Generic.enableTimeSlot(appointmentDate, appointment);
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
        status: APPOINTMENT_STATUS.cancel,
      });

      const mailText = booking_cancel_email({
        planCategory: planCategory,
        location: serviceLocation,
        appointmentDate: appointmentDate.format("LL"),
        loginUrl: process.env.CUSTOMER_APP_HOST,
        vehicleFault: vehicleFault,
        vehicleDetail: {
          year: vehicle.modelYear,
          make: vehicle.make,
          model: vehicle.model,
        },
      });

      //generate mail template
      const mailHtml = email_content({
        firstName: customer.firstName,
        signature: process.env.SMTP_EMAIL_SIGNATURE,
        text: mailText,
      });

      //send email
      await QueueManager.publish({
        data: {
          to: customer.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: "Vehicle Appointment Cancellation Confirmation",
          bcc: [
            <string>process.env.SMTP_CUSTOMER_CARE_EMAIL,
            <string>process.env.SMTP_EMAIL_FROM,
          ],
          html: mailHtml,
        },
      });

      appEventEmitter.emit(CANCEL_APPOINTMENT, {
        appointment,
      });

      return Promise.resolve({
        message: `You successfully cancelled your vehicle appointment.`,
        code: HttpStatus.OK.code,
      } as HttpResponse<string>);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private static async mutatePlanCountsAfterCancel(
    subscription: CustomerSubscription,
    serviceLocation: string
  ) {
    //handle for hybrid mode of service
    if (subscription.isHybrid) {
      //mobile service mode
      if (serviceLocation !== MAIN_OFFICE) subscription.mobileCount -= 1;
      //drive in service mode
      if (serviceLocation === MAIN_OFFICE) subscription.driveInCount -= 1;
    } else {
      if (subscription.planCategory === MOBILE_CATEGORY)
        subscription.mobileCount -= 1;
      if (subscription.planCategory === DRIVE_IN_CATEGORY)
        subscription.driveInCount -= 1;
    }

    subscription.inspections -= 1; //decrement total inspections

    await subscription.save();
  }

  private static mutateDriveInModeCountsAfterReschedule(
    serviceLocation: string,
    subscription: CustomerSubscription
  ) {
    //Only update drive in count if it is less than 1
    if (serviceLocation === MAIN_OFFICE && subscription.driveInCount < 1) {
      subscription.driveInCount += 1;
      subscription.mobileCount -= 1;
    }
  }

  private static async mutateMobileServiceModeAfterReschedule(
    serviceLocation: string,
    subscription: CustomerSubscription,
    appointment: Appointment
  ) {
    //Only update mobile count if it is less than 1
    if (serviceLocation !== MAIN_OFFICE && subscription.mobileCount < 1) {
      subscription.mobileCount += 1;
      subscription.driveInCount -= 1;

      //Enable disabled time slot since we are now on mobile service mode
      const appointmentDate = moment(appointment.appointmentDate);

      await Generic.enableTimeSlot(appointmentDate, appointment);
    }
  }
}
