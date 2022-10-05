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
import Customer from "./Customer";
import Joi from "joi";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import User from "./User";
import Partner from "./Partner";
import RideShareDriver from "./RideShareDriver";
import Technician from "./Technician";

export const $contactSchema = {
  address: Joi.string().required().label("Address"),
  city: Joi.string().allow("").label("City"),
  district: Joi.string().allow("").label("District"),
  postalCode: Joi.string().max(15).allow("").label("Postal Code"),
  state: Joi.string().allow("").label("State"),
  country: Joi.string().allow("").label("Country"),
};

@Table({
  timestamps: true,
  tableName: "contacts",
})
export default class Contact extends Model<
  InferAttributes<Contact>,
  InferCreationAttributes<Contact>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "contact_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.STRING)
  declare address: string;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare district: string;

  @Column(DataType.STRING)
  declare postalCode: string;

  @Column(DataType.STRING)
  declare state: string;

  @Column(DataType.STRING)
  declare country: string;

  @Column(DataType.STRING)
  declare mapUrl: string;

  @BelongsTo(() => Customer, { onDelete: "cascade" })
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: NonAttribute<number>;

  @BelongsTo(() => User, { onDelete: "cascade" })
  declare user: NonAttribute<User>;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: NonAttribute<number>;

  @BelongsTo(() => Partner, { onDelete: "cascade" })
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriver, { onDelete: "cascade" })
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;

  @BelongsTo(() => Technician, { onDelete: "cascade" })
  declare technician: NonAttribute<Technician>;

  @ForeignKey(() => Technician)
  @Column(DataType.INTEGER)
  declare technicianId: NonAttribute<number>;
}
