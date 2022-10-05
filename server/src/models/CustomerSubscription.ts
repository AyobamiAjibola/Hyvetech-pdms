import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Customer from "./Customer";
import Vehicle from "./Vehicle";
import CustomerPlanSubscription from "./CustomerPlanSubscription";
import Job from "./Job";
import Transaction from "./Transaction";

@Table({
  timestamps: true,
  tableName: "customer_subscriptions",
})
export default class CustomerSubscription extends Model<
  InferAttributes<CustomerSubscription>,
  InferCreationAttributes<CustomerSubscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "customer_subscription_id",
  })
  declare id: number;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare planType: string;

  @Column(DataType.STRING)
  declare planCategory: string;

  @Column(DataType.STRING)
  declare modeOfService: string;

  @Column(DataType.STRING)
  declare paymentPlan: string;

  @Column(DataType.SMALLINT)
  declare maxVehicle: number;

  @Column(DataType.SMALLINT)
  declare vehicleCount: number;

  @Column(DataType.SMALLINT)
  declare minVehicle: number;

  @Column(DataType.BOOLEAN)
  declare isHybrid: boolean;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare mobileCount: number;

  @Column(DataType.SMALLINT)
  declare maxMobile: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare driveInCount: number;

  @Column(DataType.SMALLINT)
  declare maxDriveIn: number;

  @Column(DataType.SMALLINT)
  declare inspections: number;

  @Column(DataType.STRING)
  declare subscriber: string;

  @Column(DataType.STRING)
  declare amount: string;

  @Column(DataType.STRING)
  declare programme: string;

  @Column(DataType.STRING)
  declare planCode: string;

  @Column(DataType.DATE)
  declare subscriptionDate: Date;

  @Column(DataType.DATE)
  declare nextPaymentDate: Date;

  @BelongsToMany(() => Customer, () => CustomerPlanSubscription)
  declare customers: NonAttribute<
    Array<Customer & { CustomerPlanSubscription: CustomerPlanSubscription }>
  >;

  @HasMany(() => Vehicle, { onDelete: "cascade" })
  declare vehicles: NonAttribute<Vehicle[]>;

  @HasOne(() => Transaction, { onDelete: "cascade" })
  declare transaction: NonAttribute<Transaction>;

  @BelongsTo(() => Job, { onDelete: "cascade" })
  declare job: NonAttribute<Job>;

  @ForeignKey(() => Job)
  @Column(DataType.INTEGER)
  declare jobId: NonAttribute<number>;
}
