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
import { InferAttributes } from 'sequelize/types';
import { Attributes, CreationOptional, InferCreationAttributes, NonAttribute } from 'sequelize';
import Joi from 'joi';
import RideShareDriver from './RideShareDriver';
import Vehicle from './Vehicle';
import Customer from './Customer';
import Partner from './Partner';
import Invoice from './Invoice';

export type CreateEstimateType = Attributes<Estimate & RideShareDriver & Vehicle & Partner>;

export const $createEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  id: Joi.number().required().label('Partner Id'),
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  phone: Joi.string().required().label('Phone'),
  address: Joi.string().required().label('Address'),
  addressType: Joi.string().required().label('Address Type'),
  parts: Joi.array().required().label('Parts'),
  vin: Joi.string().required().label('VIN'),
  model: Joi.string().required().label('Vehicle Model'),
  modelYear: Joi.any().required().label('Vehicle Model Year'),
  make: Joi.string().required().label('Vehicle Make'),
  plateNumber: Joi.string().allow('').label('Plate Number'),
  mileageValue: Joi.string().allow('').label('Mileage Value'),
  mileageUnit: Joi.string().allow('').label('Mileage Unit'),
  labours: Joi.array().required().label('Labours'),
  partsTotal: Joi.number().required().label('Parts Sub Total'),
  laboursTotal: Joi.number().required().label('Labours Sub Total'),
  tax: Joi.string().required().label('Tax'),
  grandTotal: Joi.number().required().label('Grand Total'),
  depositAmount: Joi.number().required().label('Deposit Amount'),
  jobDurationValue: Joi.number().required().label('Job Duration Value'),
  jobDurationUnit: Joi.string().required().label('Job Duration Unit'),
};

export const $updateEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  id: Joi.number().required().label('Estimate Id'),
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  phone: Joi.string().required().label('Phone'),
  address: Joi.string().required().label('Address'),
  addressType: Joi.string().required().label('Address Type'),
  parts: Joi.array().required().label('Parts'),
  vin: Joi.string().required().label('VIN'),
  model: Joi.string().required().label('Vehicle Model'),
  modelYear: Joi.any().required().label('Vehicle Model Year'),
  make: Joi.string().required().label('Vehicle Make'),
  plateNumber: Joi.string().allow('').label('Plate Number'),
  mileageValue: Joi.string().allow('').label('Mileage Value'),
  mileageUnit: Joi.string().allow('').label('Mileage Unit'),
  labours: Joi.array().required().label('Labours'),
  partsTotal: Joi.number().required().label('Parts Sub Total'),
  laboursTotal: Joi.number().required().label('Labours Sub Total'),
  tax: Joi.string().required().label('Tax'),
  grandTotal: Joi.number().required().label('Grand Total'),
  depositAmount: Joi.number().required().label('Deposit Amount'),
  jobDurationValue: Joi.number().required().label('Job Duration Value'),
  jobDurationUnit: Joi.string().required().label('Job Duration Unit'),
};

@Table({
  timestamps: true,
  tableName: 'estimates',
})
export default class Estimate extends Model<InferAttributes<Estimate>, InferCreationAttributes<Estimate>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'estimate_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.ARRAY(DataType.JSONB))
  declare parts: string[];

  @Column(DataType.ARRAY(DataType.JSONB))
  declare labours: string[];

  @Column(DataType.DOUBLE)
  declare partsTotal: number;

  @Column(DataType.DOUBLE)
  declare laboursTotal: number;

  @Column(DataType.DOUBLE)
  declare grandTotal: number;

  @Column(DataType.DOUBLE)
  declare depositAmount: number;

  @Column(DataType.STRING)
  declare tax: string;

  @Column(DataType.INTEGER)
  declare jobDurationValue: number;

  @Column(DataType.STRING)
  declare jobDurationUnit: string;

  @Column(DataType.STRING)
  declare address: string;

  @Column(DataType.STRING)
  declare addressType: string;

  @Column({ type: DataType.INTEGER })
  declare expiresIn: number;

  @Column(DataType.STRING)
  declare url: string;

  @HasOne(() => Invoice)
  declare invoice: NonAttribute<Invoice>;

  @BelongsTo(() => Customer)
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriver)
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;

  @BelongsTo(() => Vehicle)
  declare vehicle: NonAttribute<Vehicle>;

  @ForeignKey(() => Vehicle)
  @Column(DataType.INTEGER)
  declare vehicleId: NonAttribute<number>;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;
}
