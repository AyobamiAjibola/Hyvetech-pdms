import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InferAttributes } from "sequelize/types";
import {
  CreationOptional,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Contact from "./Contact";
import PaymentDetail from "./PaymentDetail";
import Vehicle from "./Vehicle";
import Transaction from "./Transaction";
import Appointment from "./Appointment";
import Role from "./Role";
import RideShareDriverRole from "./RideShareDriverRole";
import RideShareDriverSubscription from "./RideShareDriverSubscription";
import RideShareDriverPlanSubscription from "./RideShareDriverPlanSubscription";
import PartnerRideShareDriver from "./PartnerRideShareDriver";
import Partner from "./Partner";

@Table({
  timestamps: true,
  tableName: "ride_share_drivers",
})
export default class RideShareDriver extends Model<
  InferAttributes<RideShareDriver>,
  InferCreationAttributes<RideShareDriver>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: "ride_share_driver_id",
    allowNull: false,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare companyName: string;

  @Column(DataType.STRING)
  declare designation: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare rawPassword: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare gender: string;

  @Column(DataType.STRING)
  declare profileImageUrl: string;

  @Column(DataType.STRING)
  declare frontLicenseImageUrl: string;

  @Column(DataType.STRING)
  declare rearLicenseImageUrl: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare enabled: boolean;

  @Column(DataType.STRING(3000))
  declare loginToken: string;

  @Column(DataType.STRING)
  declare gatewayId: string;

  @Column(DataType.STRING)
  declare category: string;

  @Column(DataType.DATE)
  declare loginDate: Date;

  @HasMany(() => Contact, { onDelete: "cascade" })
  declare contacts: NonAttribute<Contact[]>;

  @HasMany(() => PaymentDetail, { onDelete: "cascade" })
  declare paymentDetails: NonAttribute<PaymentDetail[]>;

  @HasMany(() => Vehicle, { onDelete: "cascade" })
  declare vehicles: NonAttribute<Vehicle[]>;

  @HasMany(() => Transaction, { onDelete: "cascade" })
  declare transactions: NonAttribute<Transaction[]>;

  @HasMany(() => Appointment, { onDelete: "cascade" })
  declare appointments: NonAttribute<Appointment[]>;

  @BelongsToMany(
    () => RideShareDriverSubscription,
    () => RideShareDriverPlanSubscription
  )
  declare subscriptions: NonAttribute<
    Array<
      RideShareDriverSubscription & {
        RideShareDriverPlanSubscription: RideShareDriverPlanSubscription;
      }
    >
  >;

  @BelongsToMany(() => Role, () => RideShareDriverRole)
  declare roles: NonAttribute<
    Array<Role & { RideShareDriverRole: RideShareDriverRole }>
  >;

  @BelongsToMany(() => Partner, () => PartnerRideShareDriver)
  declare partners: NonAttribute<
    Array<Partner & { PartnerRideShareDriver: PartnerRideShareDriver }>
  >;
}
