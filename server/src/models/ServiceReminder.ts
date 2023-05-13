import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Joi from 'joi';
import Partner from './Partner';
import ReminderType from './ReminderType';
import Customer from './Customer';
import Vehicle from './Vehicle';

export const serviceReminderFields = {
  reminderType: {
    reminderType: 'Reminder Type',
    label: 'Reminder Type',
    error: {
      invalid: 'Reminder Type is required',
      required: 'Reminder Type is required',
    },
  },
  reminderStatus: {
    name: 'Reminder Status',
    label: 'Reminder Status',
    error: {
      invalid: 'Reminder Status is invalid',
      required: 'Reminder Status is required',
    },
  },
  serviceStatus: {
    name: 'Service Status',
    label: 'Service Status',
    error: {
      invalid: 'Service Status is invalid',
      required: 'Service Status is required',
    },
  },
  email: {
    name: 'Email',
    label: 'email',
    error: {
      invalid: 'Email is invalid',
      required: 'Email is required',
    },
  },
  phone: {
    name: 'Phone',
    label: 'phone',
    error: {
      invalid: 'Phone is invalid',
      required: 'Phone is required',
    },
  },
  vin: {
    name: 'vin',
    label: 'VIN',
    error: {
      invalid: 'VIN is invalid',
      required: 'VIN is required',
    },
  },
  model: {
    name: 'Model',
    label: 'model',
    error: {
      invalid: 'Model is invalid',
      required: 'Model is required',
    },
  },
  modelYear: {
    name: 'modelYear',
    label: 'Model Year',
    error: {
      invalid: 'Model Year is invalid',
      required: 'Model Year is required',
    },
  },
  make: {
    name: 'Make',
    label: 'make',
    error: {
      invalid: 'Make is invalid',
      required: 'Make is required',
    },
  },
  lastServiceDate: {
    name: 'Last Service Date',
    label: 'Last Service Date',
    error: {
      invalid: 'Last Service Date is invalid',
      required: 'Last Service Date is required',
    },
  },
  serviceInterval: {
    name: 'Service Interval',
    label: 'Service Interval',
    error: {
      invalid: 'Service Interval is invalid',
      required: 'Service Interval is required',
    },
  },
  serviceIntervalUnit: {
    name: 'Service Interval Unit',
    label: 'Service Interval Unit',
    error: {
      invalid: 'Service Interval Unit is invalid',
      required: 'Service Interval Unit is required',
    },
  },
  nextServiceDate: {
    name: 'Next Service Date',
    label: 'Next Service Date',
    error: {
      invalid: 'Next Service Date is invalid',
      required: 'Next Service Date is required',
    },
  },
  note: {
    name: 'Note',
    label: 'note',
    error: {
      invalid: 'Note is invalid',
      required: 'Note is required',
    },
  },
  recurring: {
    name: 'Recurring',
    label: 'Recurring',
    error: {
      invalid: 'Recurring is invalid',
      required: 'Recurring is required',
    },
  }
};

export type CreateServiceReminderType = Attributes<ServiceReminder & Vehicle & Partner>;

export const $createReminderSchema: Joi.SchemaMap<CreateServiceReminderType> = {
  id: Joi.number().required().label('Partner Id'),
  reminderType: Joi.string().required().label(serviceReminderFields.reminderType.label),
  // @ts-ignore
  email: Joi.string().required().label(serviceReminderFields.email.label),
  // @ts-ignore
  vin: Joi.string().required().label(serviceReminderFields.vin.label),
  lastServiceDate: Joi.any().required().label(serviceReminderFields.lastServiceDate.label),
  serviceInterval: Joi.string().required().allow('').label(serviceReminderFields.serviceInterval.label),
  serviceIntervalUnit: Joi.string().required().allow('').label(serviceReminderFields.serviceIntervalUnit.label),
  note: Joi.string().allow('').optional().label(serviceReminderFields.note.label),
  recurring: Joi.string().required().label(serviceReminderFields.recurring.label),
  nextServiceDate: Joi.any().required().label(serviceReminderFields.nextServiceDate.label),
  reminderStatus: Joi.any().required().label(serviceReminderFields.reminderStatus.label),
  serviceStatus: Joi.any().required().label(serviceReminderFields.serviceStatus.label),
};

export const $updateReminderSchema: Joi.SchemaMap<CreateServiceReminderType> = {
  id: Joi.number().required().label('Partner Id'),
  reminderType: Joi.string().label(serviceReminderFields.reminderType.label),
  lastServiceDate: Joi.any().label(serviceReminderFields.lastServiceDate.label),
  serviceInterval: Joi.string().allow('').label(serviceReminderFields.serviceInterval.label),
  serviceIntervalUnit: Joi.string().allow('').label(serviceReminderFields.serviceIntervalUnit.label),
  note: Joi.string().allow('').optional().label(serviceReminderFields.note.label),
  email: Joi.string().label(serviceReminderFields.email.label),
  vin: Joi.string().label(serviceReminderFields.vin.label),
  recurring: Joi.string().label(serviceReminderFields.recurring.label),
  serviceStatus: Joi.any().label(serviceReminderFields.serviceStatus.label),
};

@Table({
  tableName: 'service_reminders',
  timestamps: true,
  paranoid: true,
})
export default class ServiceReminder extends Model<InferAttributes<ServiceReminder>, InferCreationAttributes<ServiceReminder>> {
  @Column({
    type: DataType.INTEGER,
    field: 'service_reminder_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare reminderType: string;

  @Column(DataType.DATE)
  declare lastServiceDate: any;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
    declare status: boolean | null;

  @Column(DataType.STRING)
  declare serviceInterval: string;

  @Column(DataType.STRING)
  declare serviceIntervalUnit: string;

  @Column(DataType.STRING)
  declare recurring: string;

  @Column(DataType.STRING)
  declare reminderStatus: string;

  @Column(DataType.STRING)
  declare serviceStatus: string;

  @Column(DataType.DATE)
  declare nextServiceDate: any;

  @Column(DataType.STRING)
  declare note: string;

  @BelongsTo(() => ReminderType, { onDelete: 'SET NULL' })
  declare reminder: NonAttribute<ReminderType>;

  @BelongsTo(() => Partner, { onDelete: 'CASCADE' })
  declare partner: NonAttribute<Partner>;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE' })
  declare customer: NonAttribute<Customer>;

  @BelongsTo(() => Vehicle)
  declare vehicle: NonAttribute<Vehicle>;

  @ForeignKey(() => Vehicle)
  @Column(DataType.INTEGER)
  declare vehicleId: NonAttribute<number>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: NonAttribute<number>;

  @ForeignKey(() => ReminderType)
  @Column(DataType.INTEGER)
  declare reminderTypeId: NonAttribute<number>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

}
