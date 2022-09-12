import { Server } from "socket.io";
import moment from "moment";

import { appEventEmitter } from "./AppEventEmitter";
import { RESCHEDULE_APPOINTMENT } from "../config/constants";
import Appointment from "../models/Appointment";
import Customer from "../models/Customer";
import { NotificationModel } from "../models/nosql/notification";
import User from "../models/User";

interface AppointmentProps {
  appointment: Appointment;
  customer: Customer;
  user: User;
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
}
