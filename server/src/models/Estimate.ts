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

const fields = {
  firstName: {
    name: 'firstName',
    label: 'First Name',
    error: {
      invalid: 'First Name is invalid',
      required: 'First Name is required',
    },
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    error: {
      invalid: 'Last Name is invalid',
      required: 'Last Name is required',
    },
  },
  phone: {
    name: 'phone',
    label: 'Phone Number',
    error: {
      invalid: 'Phone Number is invalid',
      required: 'Phone Number is required',
    },
  },
  parts: {
    name: 'parts',
    label: 'Parts',
    error: {
      invalid: 'Part is invalid',
      required: 'Part is required',
    },
  },
  labours: {
    name: 'labours',
    label: 'Labour',
    error: {
      invalid: 'Labour is invalid',
      required: 'Labour is required',
    },
  },
  tax: {
    name: 'tax',
    label: 'Tax',
    error: {
      invalid: 'Tax is invalid',
      required: 'Tax is required',
    },
  },
  discount: {
    name: 'discount',
    label: 'Discount (%)',
    error: {
      invalid: 'Discount is invalid',
      required: 'Discount is required',
    },
  },
  address: {
    name: 'address',
    label: 'Address',
    error: {
      invalid: 'Address is invalid',
      required: 'Address is required',
    },
  },
  addressType: {
    name: 'addressType',
    label: 'Type',
    error: {
      invalid: 'Address Type is invalid',
      required: 'Address Type is required',
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
  make: {
    name: 'make',
    label: 'Make',
    error: {
      invalid: 'Make is invalid',
      required: 'Make is required',
    },
  },
  model: {
    name: 'model',
    label: 'Model',
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
  mileageValue: {
    name: 'mileage',
    label: 'Mileage Value',
    error: {
      invalid: 'Mileage Value is invalid',
      required: 'Mileage Value is required',
    },
  },
  mileageUnit: {
    name: 'mileage',
    label: 'Mileage Unit',
    error: {
      invalid: 'Mileage Unit is invalid',
      required: 'Mileage Unit is required',
    },
  },
  partsTotal: {
    name: 'mileage',
    label: 'Parts Total',
    error: {
      invalid: 'Parts Total is invalid',
      required: 'Parts Total is required',
    },
  },
  laboursTotal: {
    name: 'mileage',
    label: 'Labours Total',
    error: {
      invalid: 'Labours Total is invalid',
      required: 'Labours Total is required',
    },
  },
  grandTotal: {
    name: 'mileage',
    label: 'Grand Total',
    error: {
      invalid: 'Grand Total is invalid',
      required: 'Grand Total is required',
    },
  },
  plateNumber: {
    name: 'plateNumber',
    label: 'Plate Number',
    error: {
      invalid: 'Plate Number is invalid',
      required: 'Plate Number is required',
    },
  },
  depositAmount: {
    name: 'depositAmount',
    label: 'Deposit Amount',
    error: {
      invalid: 'Deposit Amount is invalid',
      required: 'Deposit Amount is required',
    },
  },
  jobDuration: {
    name: 'jobDuration',
    label: 'Job Duration',
    error: {
      invalid: 'Job Duration is invalid',
      required: 'Job Duration is required',
    },
  },
  jobDurationValue: {
    name: 'mileage',
    label: 'Job Duration Value',
    error: {
      invalid: 'Job Duration Value is invalid',
      required: 'Job Duration Value is required',
    },
  },
  jobDurationUnit: {
    name: 'mileage',
    label: 'Job Duration Unit',
    error: {
      invalid: 'Job Duration Unit is invalid',
      required: 'Job Duration Unit is required',
    },
  },
};

export const $createEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  id: Joi.number().required().label('Partner Id'),
  firstName: Joi.string().required().label(fields.firstName.label),
  lastName: Joi.string().required().label(fields.lastName.label),
  phone: Joi.string().required().label(fields.phone.label),
  address: Joi.string().required().label(fields.address.label),
  addressType: Joi.string().required().label(fields.addressType.label),
  parts: Joi.array().required().label(fields.parts.label),
  vin: Joi.string().required().label(fields.vin.label),
  model: Joi.string().required().label(fields.model.label),
  modelYear: Joi.any().required().label(fields.modelYear.label),
  make: Joi.string().required().label(fields.make.label),
  plateNumber: Joi.string().required().label(fields.plateNumber.label),
  mileageValue: Joi.string().required().label(fields.mileageValue.label),
  mileageUnit: Joi.string().required().label(fields.mileageUnit.label),
  labours: Joi.array().required().label(fields.labours.label),
  partsTotal: Joi.number().required().label(fields.partsTotal.label),
  laboursTotal: Joi.number().required().label(fields.laboursTotal.label),
  tax: Joi.string().required().label(fields.tax.label),
  grandTotal: Joi.number().required().label(fields.firstName.label),
  depositAmount: Joi.number().required().label(fields.depositAmount.label),
  jobDurationValue: Joi.number().required().label(fields.jobDurationValue.label),
  jobDurationUnit: Joi.string().required().label(fields.jobDurationUnit.label),
};

export const $saveEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  id: Joi.number().required().label('Partner Id'),
  firstName: Joi.string().allow('').label(fields.firstName.label),
  lastName: Joi.string().allow('').label(fields.lastName.label),
  phone: Joi.string().allow('').label(fields.phone.label),
  address: Joi.string().allow('').label(fields.address.label),
  addressType: Joi.string().allow('').label(fields.addressType.label),
  parts: Joi.array().allow().label(fields.parts.label),
  vin: Joi.string().allow('').label(fields.vin.label),
  model: Joi.string().allow('').label(fields.model.label),
  modelYear: Joi.any().allow().label(fields.modelYear.label),
  make: Joi.string().allow('').label(fields.make.label),
  plateNumber: Joi.string().allow('').label(fields.plateNumber.label),
  mileageValue: Joi.string().allow('').label(fields.mileageValue.label),
  mileageUnit: Joi.string().allow('').label(fields.mileageUnit.label),
  labours: Joi.array().allow().label(fields.labours.label),
  tax: Joi.string().allow('').label(fields.tax.label),
  laboursTotal: Joi.number().allow().label(fields.laboursTotal.label),
  partsTotal: Joi.number().allow().label(fields.partsTotal.label),
  grandTotal: Joi.number().allow().label(fields.firstName.label),
  depositAmount: Joi.string().allow('').label(fields.depositAmount.label),
  jobDurationValue: Joi.string().allow('').label(fields.jobDurationValue.label),
  jobDurationUnit: Joi.string().allow('').label(fields.jobDurationUnit.label),
};

export const $updateEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  ...$saveEstimateSchema,
  id: Joi.number().required().label('Estimate Id'),
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
