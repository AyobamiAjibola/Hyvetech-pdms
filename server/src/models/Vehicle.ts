import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
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
  declare frontImageUrl: string;

  @Column(DataType.STRING)
  declare rearImageUrl: string;

  @Column(DataType.STRING)
  declare rightSideImageUrl: string;

  @Column(DataType.STRING)
  declare leftSideImageUrl: string;

  @Column(DataType.STRING)
  declare engineBayImageUrl: string;

  @Column(DataType.STRING)
  declare instrumentClusterImageUrl: string;

  @Column(DataType.STRING)
  declare nickname: string;

  @Column(DataType.STRING)
  declare mileageUnit: string;

  @Column(DataType.STRING)
  declare mileageValue: string;

  @Column(DataType.STRING)
  declare frontTireSpec: string;

  @Column(DataType.STRING)
  declare rearTireSpec: string;

  @Column(DataType.STRING)
  declare plateNumber: string;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.BOOLEAN)
  declare isBooked: boolean;

  @Column(DataType.BOOLEAN)
  declare isOwner: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare onInspection: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare onMaintenance: boolean;

  @BelongsTo(() => Customer, { onDelete: "cascade" })
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: number;

  @BelongsTo(() => Appointment, { onDelete: "cascade" })
  declare appointment: NonAttribute<Appointment>;

  @ForeignKey(() => Appointment)
  @Column(DataType.INTEGER)
  declare appointmentId: number;

  @BelongsTo(() => CustomerSubscription, { onDelete: "cascade" })
  declare subscription: NonAttribute<CustomerSubscription>;

  @ForeignKey(() => CustomerSubscription)
  @Column(DataType.INTEGER)
  declare customerSubscriptionId: number;

  @BelongsTo(() => RideShareDriver, { onDelete: "cascade" })
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriverSubscription, { onDelete: "cascade" })
  declare rideShareDriverSubscription: NonAttribute<RideShareDriverSubscription>;

  @ForeignKey(() => RideShareDriverSubscription)
  @Column(DataType.INTEGER)
  declare rideShareDriverSubscriptionId: number;

  @HasMany(() => Job, { onDelete: "cascade" })
  declare jobs: NonAttribute<Array<Job>>;

  @BelongsToMany(() => Tag, () => VehicleTag)
  declare tags: NonAttribute<Array<Tag & { VehicleTag: VehicleTag }>>;
}
