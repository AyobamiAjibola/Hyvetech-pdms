import { Server } from 'socket.io';
import moment from 'moment';

import dataSources from '../services/dao';

import { appEventEmitter } from './AppEventEmitter';
import {
  APPROVE_JOB,
  ASSIGN_DRIVER_JOB,
  CREATED_ESTIMATE,
  INIT_TRANSACTION,
  NOTIFICATION_SEEN,
  RESCHEDULE_APPOINTMENT,
  TXN_CANCELLED,
  TXN_REFERENCE,
  VERIFY_TRANSACTION,
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
import Vehicle from '../models/Vehicle';
import Transaction from '../models/Transaction';
import axios from 'axios';
import { appCommonTypes } from '../@types/app-common';
import AppLogger from '../utils/AppLogger';
import IFirebaseData = appCommonTypes.IFirebaseData;

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
  customer: Customer;
  vehicle: Vehicle;
  partner: Partner;
}

interface IInitTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface INotificationProps {
  customer: Customer;
  transaction: Transaction;
  response: IInitTransactionResponse;
  message: string;
}

interface IServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

export default function eventManager(io: Server) {
  axios.defaults.baseURL = process.env.GOOGLE_FCM_HOST;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Authorization'] = `key=${process.env.AUTOHYVE_FCM_SERVER_KEY}`;

  const LOG = AppLogger.init(eventManager.name).logger;

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
      let id = 0;
      let expoSlug = '';

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

      if (driver) {
        eventId = driver.pushToken;
        id = driver.id;
        expoSlug = driver.expoSlug;
      }
      if (customer) {
        eventId = customer.pushToken;
        id = customer.id;
        expoSlug = customer.expoSlug;
      }

      const notification = {
        seen: false,
        from: `${job.partner.name}`,
        to: id,
        type: 'Job',
        subject: 'Approved Job',
        message: `Job on your vehicle ${job.vehicle.make} ${job.vehicle.model} has been approved`,
      };

      await NotificationModel.create(notification);

      if (eventId.length) {
        const data = JSON.stringify({
          to: eventId,
          priority: 'normal',
          data: {
            experienceId: `@jiffixproductmanager/${expoSlug}`,
            scopeKey: `@jiffixproductmanager/${expoSlug}`,
            title: `${job.partner.name} Approved Job`,
            message: `Job on your vehicle ${job.vehicle.make} ${job.vehicle.model} has been approved`,
            sound: true,
            vibrate: true,
            priority: 'max',
          } as IFirebaseData,
        });

        const response = await axios.post('/send', data);

        LOG.info(response.data);
      }
    })();
  });

  appEventEmitter.on(CREATED_ESTIMATE, (props: ICreatedEstimateProps) => {
    const { estimate, customer, partner, vehicle } = props;

    (async () => {
      const notification = {
        seen: false,
        from: `${partner.name}`,
        to: customer.id,
        type: 'Estimate',
        subject: `Estimate for your vehicle ${vehicle.make} ${vehicle.model} has been created`,
        message: estimate.toJSON(),
      };

      await NotificationModel.create(notification);

      const data = JSON.stringify({
        to: customer.pushToken,
        priority: 'normal',
        data: {
          experienceId: `@jiffixproductmanager/${customer.expoSlug}`,
          scopeKey: `@jiffixproductmanager/${customer.expoSlug}`,
          title: `${partner.name} Estimate`,
          message: `Estimate for your vehicle ${vehicle.make} ${vehicle.model} has been created`,
          sound: true,
          vibrate: true,
          priority: 'max',
        } as IFirebaseData,
      });

      const response = await axios.post('/send', data);

      LOG.info(response.data);
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

  appEventEmitter.on(INIT_TRANSACTION, (props: INotificationProps) => {
    const { customer, response } = props;

    (async () => {
      const notification = await NotificationModel.create({
        seen: false,
        from: `System`,
        to: customer.id,
        type: 'Transaction',
        subject: 'Transaction Initialized',
        message: response,
      });

      io.to(customer.eventId).emit(INIT_TRANSACTION, {
        notification: notification.toJSON({ flattenMaps: true }),
      });
    })();
  });

  appEventEmitter.on(VERIFY_TRANSACTION, (props: INotificationProps) => {
    const { customer, transaction } = props;

    (async () => {
      const notification = await NotificationModel.create({
        seen: false,
        from: `System`,
        to: customer.id,
        type: 'Transaction',
        subject: 'Transaction Verified',
        message: transaction,
      });

      io.to(customer.eventId).emit(VERIFY_TRANSACTION, {
        notification: notification.toJSON({ flattenMaps: true }),
      });
    })();
  });
}
