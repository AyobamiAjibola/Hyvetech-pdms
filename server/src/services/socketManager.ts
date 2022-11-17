import { Server } from 'socket.io';
import moment from 'moment';

import dataSources from '../services/dao';

import { appEventEmitter } from './AppEventEmitter';
import {
  APPROVE_JOB,
  ASSIGN_DRIVER_JOB,
  CREATED_ESTIMATE,
  NOTIFICATION_SEEN,
  RESCHEDULE_APPOINTMENT,
  TXN_CANCELLED,
  TXN_REFERENCE,
} from '../config/constants';
import Appointment from '../models/Appointment';
import Customer from '../models/Customer';
import { NotificationModel } from '../models/nosql/notification';
import User from '../models/User';
import Job from '../models/Job';
import Partner from '../models/Partner';
import { Op } from 'sequelize';
import Estimate from '../models/Estimate';
import mongoose from 'mongoose';

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

export interface ICreatedEstimateProps {
  estimate: Estimate;
}

export default function socketManager(io: Server) {
  appEventEmitter.on(RESCHEDULE_APPOINTMENT, (props: AppointmentProps) => {
    const { appointment, customer, user } = props;

    (async () => {
      const notification = await NotificationModel.create({
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
              ${moment(appointment.appointmentDate).format('LL')}.`,
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
      const technician = await dataSources.technicianDAOService.findById(techId);

      if (!technician) throw new Error(`Technician with Id: ${techId} does not exist`);

      const notification = await NotificationModel.create({
        seen: false,
        from: `${partner.name}`,
        to: techId,
        type: 'Job',
        subject: 'Vehicle Inspection',
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
      const [firstName, lastName] = job.vehicleOwner.split(' ');

      let eventId = '';

      const customer = await dataSources.customerDAOService.findByAny({
        where: {
          [Op.and]: [{ firstName }, { lastName }],
        },
      });

      const driver = await dataSources.rideShareDriverDAOService.findByAny({
        where: {
          [Op.and]: [{ firstName }, { lastName }],
        },
      });

      if (driver) eventId = driver.eventId;
      if (customer) eventId = customer.eventId;

      const notification = await NotificationModel.create({
        seen: false,
        from: `${job.partner.name}`,
        to: `${job.vehicleOwner}_${job.id}`,
        type: 'Job',
        subject: 'Approved Job',
        message: `Job on your vehicle ${job.vehicle.make} ${job.vehicle.model} has been approved`,
      });

      if (eventId.length) {
        io.to(eventId).emit(APPROVE_JOB, {
          notification,
        });
      } else {
        io.emit(APPROVE_JOB, {
          notification,
        });
      }
    })();
  });

  appEventEmitter.on(CREATED_ESTIMATE, (props: ICreatedEstimateProps) => {
    const { estimate } = props;

    (async () => {
      const customer = await estimate.$get('customer');
      const partner = await estimate.$get('partner');
      const vehicle = await estimate.$get('vehicle');

      if (!customer) throw new Error('Estimate appears not to belong to a customer.');
      if (!partner) throw new Error('Estimate appears not to belong to a partner.');
      if (!vehicle) throw new Error('Estimate appears not to belong to a vehicle.');

      const notification = await NotificationModel.create({
        seen: false,
        from: `${estimate.partner.name}`,
        to: `${customer.firstName}_${estimate.id}`,
        type: 'Estimate',
        subject: 'Estimate Created',
        message: `Estimate for your vehicle ${vehicle.make} ${vehicle.model} has been created`,
      });

      io.to(customer.eventId).emit(CREATED_ESTIMATE, {
        notification,
      });
    })();
  });

  appEventEmitter.on(TXN_CANCELLED, args => {
    io.emit(TXN_CANCELLED, args);
  });

  appEventEmitter.on(TXN_REFERENCE, args => {
    io.emit(TXN_REFERENCE, args);
  });

  io.on(NOTIFICATION_SEEN, (id: mongoose.Types.ObjectId) => {
    (async () => {
      await NotificationModel.findByIdAndUpdate(id, { seen: true });
    })();
  });
}
