import { Server } from "socket.io";
import moment from "moment";

import dataSources from "../services/dao";

import { appEventEmitter } from "./AppEventEmitter";
import {
  APPROVE_JOB,
  ASSIGN_DRIVER_JOB,
  RESCHEDULE_APPOINTMENT,
  TXN_CANCELLED,
  TXN_REFERENCE,
} from "../config/constants";
import Appointment from "../models/Appointment";
import Customer from "../models/Customer";
import { NotificationModel } from "../models/nosql/notification";
import User from "../models/User";
import Job from "../models/Job";
import Partner from "../models/Partner";

interface AppointmentProps {
  appointment: Appointment;
  customer: Customer;
  user: User;
}

export interface AssignJobProps {
  techId: number;
  partner: Partner;
}

export interface ApprovedJobProps {
  job: Job;
  techId: number;
  partner: Partner;
}

export default function socketManager(io: Server) {
  appEventEmitter.on(RESCHEDULE_APPOINTMENT, (props: AppointmentProps) => {
    const { appointment, customer, user } = props;

    (async () => {
      const notification = await NotificationModel.create({
        seen: false,
        from: `${user.firstName} ${user.lastName}`,
        to: customer.id,
        type: "Appointment",
        subject: "Inspection Reschedule",
        message: {
          appointmentId: appointment.id,
          text: `Your ${appointment.modeOfService} 
              inspection service has been rescheduled to 
              ${appointment.timeSlot},
              ${moment(appointment.appointmentDate).format("LL")}.`,
        },
      });

      io.emit(RESCHEDULE_APPOINTMENT, {
        notification,
      });
    })();
  });

  appEventEmitter.on(ASSIGN_DRIVER_JOB, (props: AssignJobProps) => {
    const { techId, partner } = props;

    (async () => {
      const technician = await dataSources.technicianDAOService.findById(
        techId
      );

      if (!technician)
        throw new Error(`Technician with Id: ${techId} does not exist`);

      const notification = await NotificationModel.create({
        seen: false,
        from: `${partner.name}`,
        to: techId,
        type: "Job",
        subject: "Vehicle Inspection",
        message: `New Job Assigned`,
      });

      io.to(technician.eventId).emit(ASSIGN_DRIVER_JOB, {
        notification: notification.toJSON({ flattenMaps: true }),
      });
    })();
  });

  appEventEmitter.on(APPROVE_JOB, (props: ApprovedJobProps) => {
    const { job } = props;

    (async () => {
      const notification = await NotificationModel.create({
        seen: false,
        from: `${job.partner.name}`,
        to: job.id,
        type: "Job",
        subject: "Approved Job",
        message: `Job on your vehicle ${job.vehicle.make} ${job.vehicle.model} has been approved`,
      });

      io.emit(APPROVE_JOB, {
        notification,
      });
    })();
  });

  appEventEmitter.on(TXN_CANCELLED, (args) => {
    io.emit(TXN_CANCELLED, args);
  });

  appEventEmitter.on(TXN_REFERENCE, (args) => {
    io.emit(TXN_REFERENCE, args);
  });
}
