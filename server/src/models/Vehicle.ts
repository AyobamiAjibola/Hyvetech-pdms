import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Customer from "./Customer";
import Joi from "joi";
import { VIN_PATTERN } from "../config/constants";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Appointment from "./Appointment";
import VehicleTag from "./VehicleTag";
import Tag from "./Tag";
import CustomerSubscription from "./CustomerSubscription";
import RideShareDriver from "./RideShareDriver";
import RideShareDriverSubscription from "./RideShareDriverSubscription";
import Job from "./Job";

export const $vehicleSchema = {
  model: Joi.string().required().label("Car Model"),
  make: Joi.string().required().label("Car Make"),
  vin: Joi.string()
    .pattern(VIN_PATTERN)
    .allow("")
    .label("Vehicle Identification Number"),
  engineCylinders: Joi.string().allow("").label("Engine Type"),
  engineModel: Joi.string().allow("").label("Engine Model"),
  modelYear: Joi.string().allow("").label("Car Model Year"),
};

@Table({
  timestamps: true,

  tableName: "vehicles",
})
export default class Vehicle extends Model<
  InferAttributes<Vehicle>,
  InferCreationAttributes<Vehicle>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "vehicle_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare vin: string;

  @Column(DataType.STRING)
  declare model: string;

  @Column(DataType.STRING)
  declare make: string;

  @Column(DataType.STRING)
  declare engineCylinders: string;

  @Column(DataType.STRING)
  declare modelYear: string;

  @Column(DataType.STRING)
  declare engineModel: string;

  @Column(DataType.STRING)
  declare imageUrl: string;

  @Column(DataType.STRING)
  declare roadWorthinessFileUrl: string;

  @Column(DataType.STRING)
  declare proofOfOwnershipFileUrl: string;

  @Column(DataType.STRING)
  declare registrationNumberFileUrl: string;

  @Column(DataType.STRING)
  declare motorReceiptFileUrl: string;

  @Column(DataType.STRING)
  declare vehicleInspectionFileUrl: string;

  @Column(DataType.STRING)
  declare thirdPartyInsuranceFileUrl: string;

  @Column(DataType.STRING)
  declare nickname: string;

  @Column(DataType.STRING)
  declare plateNumber: string;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.BOOLEAN)
  declare isBooked: boolean;

  @Column(DataType.BOOLEAN)
  declare isOwner: boolean;

  @BelongsTo(() => Customer)
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: number;

  @BelongsTo(() => Appointment)
  declare appointment: NonAttribute<Appointment>;

  @ForeignKey(() => Appointment)
  @Column(DataType.INTEGER)
  declare appointmentId: number;

  @BelongsTo(() => CustomerSubscription)
  declare subscription: NonAttribute<CustomerSubscription>;

  @ForeignKey(() => CustomerSubscription)
  @Column(DataType.INTEGER)
  declare customerSubscriptionId: number;

  @BelongsTo(() => RideShareDriver)
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriverSubscription)
  declare rideShareDriverSubscription: NonAttribute<RideShareDriverSubscription>;

  @ForeignKey(() => RideShareDriverSubscription)
  @Column(DataType.INTEGER)
  declare rideShareDriverSubscriptionId: number;

  @BelongsTo(() => Job)
  declare job: NonAttribute<Job>;

  @ForeignKey(() => Job)
  @Column(DataType.INTEGER)
  declare jobId: number;

  @BelongsToMany(() => Tag, () => VehicleTag)
  declare tags: NonAttribute<Array<Tag & { VehicleTag: VehicleTag }>>;
}
