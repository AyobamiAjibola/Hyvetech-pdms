import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InferAttributes } from "sequelize/types";
import {
  Attributes,
  CreationOptional,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Joi from "joi";
import RideShareDriver from "./RideShareDriver";
import Vehicle from "./Vehicle";

export type CreateEstimateType = Attributes<
  Estimate & RideShareDriver & Vehicle
> & { address: Joi.SchemaLike };

export const $createEstimateSchema: Joi.SchemaMap<CreateEstimateType> = {
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  phone: Joi.string().required().label("Phone"),
  address: Joi.string().allow("").label("Address"),
  parts: Joi.array().required().label("Parts"),
  vin: Joi.string().required().label("VIN"),
  model: Joi.string().required().label("Vehicle Model"),
  make: Joi.string().required().label("Vehicle Make"),
  plateNumber: Joi.string().allow("").label("Plate Number"),
  mileageValue: Joi.string().allow("").label("Mileage Value"),
  mileageUnit: Joi.string().allow("").label("Mileage Unit"),
  labours: Joi.array().required().label("Labours"),
  partsTotal: Joi.number().required().label("Parts Sub Total"),
  laboursTotal: Joi.number().required().label("Labours Sub Total"),
  grandTotal: Joi.number().required().label("Grand Total"),
  depositAmount: Joi.number().required().label("Deposit Amount"),
  jobDurationValue: Joi.number().required().label("Job Duration Value"),
  jobDurationUnit: Joi.number().required().label("Job Duration Unit"),
};

@Table({
  timestamps: true,
  tableName: "estimates",
})
export default class Estimate extends Model<
  InferAttributes<Estimate>,
  InferCreationAttributes<Estimate>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "estimate_id", allowNull: false })
  declare id: CreationOptional<number>;

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

  @Column(DataType.INTEGER)
  declare jobDurationValue: number;

  @Column(DataType.STRING)
  declare jobDurationUnit: string;

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
}
