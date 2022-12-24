import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import VehicleFault from './VehicleFault';
import Customer from './Customer';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Vehicle from './Vehicle';
import Joi from 'joi';
import RideShareDriver from './RideShareDriver';

export const $rescheduleInspectionSchema = {
  customerId: Joi.number().required().label('Customer Id'),
  time: Joi.date().iso().required().label('Appointment Date'),
  timeSlot: Joi.string().allow('').label('Time Slot'),
  location: Joi.string().allow('').label('Location'),
  vehicleFault: Joi.string().allow('').label('Vehicle Fault'),
  planCategory: Joi.string().allow('').label('Plans Category'),
  image: Joi.string().allow('').label('Vehicle Fault Image'),
  video: Joi.string().allow('').label('Vehicle Fault Video'),
};

export const $cancelInspectionSchema = {
  customerId: Joi.number().required().label('Customer Id'),
};

@Table({
  timestamps: true,
  tableName: 'appointments',
})
export default class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'appointment_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.DATE)
  declare appointmentDate: Date;

  @Column(DataType.STRING)
  declare serviceLocation: string;

  @Column(DataType.STRING)
  declare timeSlot: string;

  @Column(DataType.STRING)
  declare planCategory: string;

  @Column(DataType.STRING)
  declare modeOfService: string;

  @Column(DataType.STRING)
  declare programme: string;

  @Column(DataType.STRING)
  declare serviceCost: string;

  @Column(DataType.STRING)
  declare inventoryFile: string;

  @Column(DataType.STRING)
  declare reportFile: string;

  @Column(DataType.STRING)
  declare estimateFile: string;

  @HasOne(() => Vehicle, { onDelete: 'SET NULL' })
  declare vehicle: NonAttribute<Vehicle>;

  @HasOne(() => VehicleFault, { onDelete: 'SET NULL' })
  declare vehicleFault: NonAttribute<VehicleFault>;

  @BelongsTo(() => Customer, { onDelete: 'SET NULL' })
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: number;

  @BelongsTo(() => RideShareDriver, { onDelete: 'SET NULL' })
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;
}
