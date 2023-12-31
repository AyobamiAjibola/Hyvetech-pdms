import { appCommonTypes } from '../@types/app-common';

import HttpResponse = appCommonTypes.HttpResponse;
import { Request } from "express";
import { TryCatch } from "../decorators";
import ReminderType, { $saveReminderTypeSchema, $updateReminderTypeSchema, reminderTypeSchemaType } from "../models/ReminderType";
import HttpStatus from "../helpers/HttpStatus";
import Joi from 'joi';
import CustomAPIError from '../exceptions/CustomAPIError';
import dao from '../services/dao';
import { CreationAttributes, Op } from 'sequelize';
import ServiceReminder, { $createReminderSchema, $updateReminderSchema, CreateServiceReminderType } from '../models/ServiceReminder';
import Vehicle from '../models/Vehicle';
import Customer from '../models/Customer';
import { appEventEmitter } from '../services/AppEventEmitter';
import Contact from '../models/Contact';
import User from '../models/User';
import { CREATED_REMINDER, UPDATED_REMINDER } from '../config/constants';
import Generic from '../utils/Generic';


export default class ServiceReminderController {

    @TryCatch
    public async createReminderTypeHandler(req: Request) {
      const reminderType = await this.doCreateReminderType(req);

      const response: HttpResponse<ReminderType> = {
        code: HttpStatus.OK.code,
        message: 'Reminder type created successfully.',
        result: reminderType
      };

      return Promise.resolve(response);
    }

  @TryCatch
  public async updateReminderTypeHandler(req: Request) {
      const reminderType = await this.doReminderTypeUpdate(req);

      const response: HttpResponse<ReminderType> = {
        code: HttpStatus.OK.code,
        message: 'Reminder type updated successfully.',
        result: reminderType,
      };

      return Promise.resolve(response);
    }

  @TryCatch
  public async updateReminderStatus(req: Request) {
    const reminder = await this.doUpdateReminderStatus(req);

    const response: HttpResponse<ServiceReminder> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: reminder,
    };

    return response;
  }

  @TryCatch
  public async createServiceReminderHandler(req: Request) {
      const serviceReminder = await this.doCreateServiceReminder(req);

      try {
        appEventEmitter.emit(CREATED_REMINDER, { serviceReminder });
      } catch (e) {
        console.log(e);
      }

      const response: HttpResponse<ServiceReminder> = {
        code: HttpStatus.OK.code,
        message: 'Reminder created successfully.',
        result: serviceReminder
      };

      return Promise.resolve(response);
  }

  @TryCatch
  public async reminders(req: Request) {
      const partner = req.user.partner;

      let reminders: ServiceReminder[];

      reminders = await partner.$get('reminders', {
        include: [
          Vehicle,
          { model: Customer, include: [Contact], paranoid: false }
        ]
      });

      reminders.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      for (let i = 0; i < reminders.length; i++) {
        let reminderStatus = reminders[i].recurring === 'yes'
                        ? Generic.reminderStatus(
                            reminders[i].lastServiceDate,
                            reminders[i].nextServiceDate,
                            reminders[i].serviceIntervalUnit,
                            reminders[i].serviceInterval
                          )
                        : 'Not Available';

        let nextServiceDate = Generic.nextServiceDate(
                                reminders[i].lastServiceDate,
                                reminders[i].serviceIntervalUnit,
                                reminders[i].serviceInterval
                              )

        const updatedReminder: Partial<ServiceReminder> = {
          reminderStatus: reminderStatus,
          nextServiceDate: nextServiceDate,
          serviceStatus: reminders[i].recurring === 'yes'
                          ? reminderStatus?.split(" ")[0] === 'Overdue'
                            ? 'not_done' : 'active'
                          : 'not_done'
        };

        await reminders[i].update(updatedReminder);
      }

      const response: HttpResponse<ServiceReminder> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: reminders
      };

      return Promise.resolve(response);
  }

  @TryCatch
  public async updateReminder(req: Request) {
    const reminder = await this.doUpdateReminder(req);

    try {
      appEventEmitter.emit(UPDATED_REMINDER, { reminder });
    } catch (e) {
      console.log(e);
    }

    const response: HttpResponse<ServiceReminder> = {
      code: HttpStatus.OK.code,
      message: 'Reminder updated successfully.',
      result: reminder,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  public async getAllReminderTypes(req: Request) {
    const reminders = await dao.reminderTypeDAOService.findAll({});

    const data = reminders.filter(item => item.partnerId === req.user.partner.id || !item.partnerId);

    const response: HttpResponse<ReminderType> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: data,
    };

    return response;
  }

  @TryCatch
  public async deleteReminder(req: Request) {
    const reminderId = req.params.reminderId as string;

    const reminder = await dao.serviceReminderDAOService.findById(+reminderId);

    if (!reminder) return Promise.reject(CustomAPIError.response(`Reminder not found`, HttpStatus.NOT_FOUND.code));

    if (reminder.status === true)
      return Promise.reject(
        CustomAPIError.response(`Cannot delete an active reminder. First disable reminder to delete`, HttpStatus.BAD_REQUEST.code),
      );

    await ServiceReminder.destroy({ where: { id: +reminderId }, force: true });

    return Promise.resolve({
      code: HttpStatus.ACCEPTED.code,
      message: 'Reminder deleted successfully',
    } as HttpResponse<void>);
  }

  @TryCatch
  public async resetServiceDate(req: Request) {
    const reminderId = req.params.reminderId as string;

    const reminder = await dao.serviceReminderDAOService.findById(+reminderId);

    if (!reminder) return Promise.reject(CustomAPIError.response(`Reminder not found`, HttpStatus.NOT_FOUND.code));

    // const { error, value } = Joi.object<CreateServiceReminderType>($updateReminderSchema).validate(req.body);
    // if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    // if (!value)
    //   return Promise.reject(
    //     CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
    //   );

    if(reminder.recurring === 'yes') {
      if(reminder.serviceStatus === 'not_done' || reminder.serviceStatus || 'active') {
        const reminderValues: Partial<ServiceReminder> = {
          lastServiceDate: reminder.serviceStatus && new Date()
        }

        await reminder.update(reminderValues);

        return Promise.resolve({
          code: HttpStatus.ACCEPTED.code,
          message: 'Last service date reset successfully',
        } as HttpResponse<void>);
      }
    } else {
      await ServiceReminder.destroy({ where: { id: +reminderId }});

      return Promise.resolve({
        code: HttpStatus.ACCEPTED.code,
        message: 'Reminder deleted successfully',
      } as HttpResponse<void>);
    }

  }

  @TryCatch
  public async serviceReminders(req: Request) {
    const partnerId = req.user.partner.id;

    const reminders = await dao.serviceReminderDAOService.findAll({
      where: {
        partnerId: partnerId,
        deletedAt: { [Op.not]: null }
      },
      paranoid: false
    });

    const response: HttpResponse<ServiceReminder> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: reminders
    };

    return Promise.resolve(response);
  }

  private async doCreateServiceReminder(req: Request) {
    const { error, value } = Joi.object<CreateServiceReminderType>($createReminderSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
    );

    const partner = await dao.partnerDAOService.findById(value.id, { include: [Contact, User] });

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
    );

    const vehicle = await dao.vehicleDAOService.findByVIN(value.vin);

    if (!vehicle)
      return Promise.reject(
        CustomAPIError.response(`Vehicle with vin: ${value.vin} does not exist`, HttpStatus.NOT_FOUND.code),
    );

    const customer = await dao.customerDAOService.findByAny({
      where: {email: value.email}
    });

    if (!customer)
      return Promise.reject(
        CustomAPIError.response(`Customer does not exist`, HttpStatus.NOT_FOUND.code),
    );

    const reminderType = await dao.reminderTypeDAOService.findByAny({
      where: {name: value.reminderType}
    });

    if (!reminderType)
      return Promise.reject(
        CustomAPIError.response(`Reminder Type does not exist`, HttpStatus.NOT_FOUND.code),
    );

    const data: Partial<ServiceReminder> = {
        reminderType: value.reminderType,
        lastServiceDate: value.lastServiceDate,
        nextServiceDate: value.nextServiceDate || new Date,
        serviceInterval: value.serviceInterval,
        serviceIntervalUnit: value.serviceIntervalUnit,
        lastServiceMileage: value.lastServiceMileage,
        lastServiceMileageUnit: value.lastServiceMileageUnit,
        nextServiceMileage: value.nextServiceMileage,
        nextServiceMileageUnit: value.nextServiceMileageUnit,
        note: value.note,
        recurring: value.recurring,
        reminderStatus: value.reminderStatus || 'Not Available',
        serviceStatus: value.serviceStatus
      };

      const serviceReminder = await dao.serviceReminderDAOService.create(data as CreationAttributes<ServiceReminder>);

      await partner.$add('reminders', [serviceReminder]);
      await customer.$add('reminders', [serviceReminder]);
      await vehicle.$add('reminders', [serviceReminder]);
      await reminderType.$add('reminder', [serviceReminder])

      return serviceReminder;
  }

  private async doUpdateReminder(req: Request) {
    const reminderId = req.params.reminderId as string;

    const reminder = await dao.serviceReminderDAOService.findById(+reminderId)

    if (!reminder) return Promise.reject(CustomAPIError.response(`Reminder not found`, HttpStatus.NOT_FOUND.code));

    const { error, value } = Joi.object<CreateServiceReminderType>($updateReminderSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const _nextDate = Generic.nextServiceDate(value.lastServiceDate, value.serviceIntervalUnit, value.serviceInterval);
    const _reminder = Generic.reminderStatus(value.lastServiceDate, _nextDate, value.serviceIntervalUnit, value.serviceInterval);

    const reminderValues: Partial<ServiceReminder> = {
      reminderType: value.reminderType,
      lastServiceDate: value.lastServiceDate,
      nextServiceDate: value.recurring === 'yes' ? Generic.nextServiceDate(value.lastServiceDate, value.serviceIntervalUnit, value.serviceInterval) : new Date(),
      serviceInterval: value.serviceInterval,
      serviceIntervalUnit: value.serviceIntervalUnit,
      lastServiceMileage: value.lastServiceMileage,
      lastServiceMileageUnit: value.lastServiceMileageUnit,
      nextServiceMileage: value.nextServiceMileage,
      nextServiceMileageUnit: value.nextServiceMileageUnit,
      note: value.note,
      recurring: value.recurring,
      reminderStatus: value.recurring === 'yes' ? Generic.reminderStatus(value.lastServiceDate, value.nextServiceDate, value.serviceIntervalUnit, value.serviceInterval) : 'Not Available',
      serviceStatus: value.recurring === 'yes'
                      ? _reminder?.split(" ")[0] === 'Overdue'
                        ? 'not_done' : 'active'
                      : 'not_done'
    }

    await reminder.update(reminderValues);

    return reminder;
  }

  private async doReminderTypeUpdate(req: Request) {
    const reminderTypeId = req.params.reminderTypeId as string;

    const reminder = await dao.reminderTypeDAOService.findById(+reminderTypeId)

    if (!reminder)
      return Promise.reject(CustomAPIError.response('Reminder Type not found', HttpStatus.BAD_REQUEST.code));

    const { error, value } = Joi.object<ReminderType>($updateReminderTypeSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const values: Partial<ReminderType> = {
      name: value?.name
    };

    await reminder.update(values);

    return reminder;
  }

  private async doCreateReminderType(req: Request) {
    const partnerId = req.user.partner.id;
    const { error, value } = Joi.object<reminderTypeSchemaType>($saveReminderTypeSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
    );

    const partner = await dao.partnerDAOService.findById(partnerId);

    if (!partner)
      return Promise.reject(
        CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
    );

    const reminderType = await dao.reminderTypeDAOService.findByAny({
      where: { name: value.name, partnerId: partnerId }
    });

    if (reminderType)
      return Promise.reject(CustomAPIError.response('Reminder type already exists.', HttpStatus.BAD_REQUEST.code));

    const typeValue: Partial<ReminderType> = {
      name: value.name,
      partnerId: value.id
    }
    const type = await dao.reminderTypeDAOService.create(typeValue as CreationAttributes<ReminderType>);

    await partner.$add('reminderTypes', [type]);
    return type;
  }

  private async doUpdateReminderStatus(req: Request) {
    const reminderId = req.params.reminderId as string;

    const reminder = await dao.serviceReminderDAOService.findById(+reminderId);

    if (!reminder) return Promise.reject(CustomAPIError.response('Reminder not found', HttpStatus.BAD_REQUEST.code));

    const reminderStatus: Partial<ServiceReminder> = {
      status: !reminder.status
  }
    return reminder.update(reminderStatus);
  }
}