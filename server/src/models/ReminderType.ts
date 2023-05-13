import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Joi from 'joi';
import Partner from './Partner';
import ServiceReminder from './ServiceReminder';
// import ServiceReminder from './ServiceReminder';

export const reminderTypeFields = {
    name: {
      name: 'name',
      label: 'name',
      error: {
        invalid: 'Name is required',
        required: 'Name is required',
      },
    },
};

export type reminderTypeSchemaType = Attributes<ReminderType>;

export const $saveReminderTypeSchema: Joi.SchemaMap<reminderTypeSchemaType> = {
  id: Joi.number().required().label('Partner Id'),
  name: Joi.string().required().label(reminderTypeFields.name.label)
};

export const $updateReminderTypeSchema: Joi.SchemaMap<reminderTypeSchemaType> = {
  id: Joi.number().required().label('Reminder Type Id'),
  name: Joi.string().required().label(reminderTypeFields.name.label)
};

@Table({
  tableName: 'reminder_types',
  timestamps: true,
  paranoid: true,
})
export default class ReminderType extends Model<InferAttributes<ReminderType>, InferCreationAttributes<ReminderType>> {
  @Column({
    type: DataType.INTEGER,
    field: 'reminder_type_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING })
  declare name: string;

  @BelongsTo(() => Partner, { onDelete: 'CASCADE' })
  declare partner: NonAttribute<Partner>;

  @HasMany(() => ServiceReminder)
  declare reminders: NonAttribute<ServiceReminder[]>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;
}