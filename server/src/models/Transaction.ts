import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import Customer from "./Customer";
import RideShareDriver from "./RideShareDriver";
import CustomerSubscription from "./CustomerSubscription";
import RideShareDriverSubscription from "./RideShareDriverSubscription";

@Table({
  timestamps: true,

  underscored: true,
  freezeTableName: true,
  tableName: "transactions",
})
export default class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "transaction_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare reference: string;

  @Column(DataType.DOUBLE)
  declare amount: number;

  @Column(DataType.STRING)
  declare status: string;

  @Column({ type: DataType.STRING, defaultValue: "unprocessed" })
  declare serviceStatus: string;

  @Column(DataType.STRING)
  declare authorizationUrl: string;

  @Column(DataType.BOOLEAN)
  declare isRequestForInspection: boolean;

  @Column(DataType.STRING)
  declare purpose: string;

  @Column(DataType.STRING)
  declare last4: string;

  @Column(DataType.STRING)
  declare expMonth: string;

  @Column(DataType.STRING)
  declare expYear: string;

  @Column(DataType.STRING)
  declare channel: string;

  @Column(DataType.STRING)
  declare cardType: string;

  @Column(DataType.STRING)
  declare bank: string;

  @Column(DataType.STRING)
  declare countryCode: string;

  @Column(DataType.STRING)
  declare brand: string;

  @Column(DataType.STRING)
  declare currency: string;

  @Column(DataType.STRING)
  declare planCode: string;

  @Column(DataType.DATE)
  declare paidAt: Date;

  @BelongsTo(() => CustomerSubscription, { onDelete: "cascade" })
  declare customerSubscription: NonAttribute<CustomerSubscription>;

  @ForeignKey(() => CustomerSubscription)
  @Column(DataType.INTEGER)
  declare customerSubscriptionId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriverSubscription, { onDelete: "cascade" })
  declare rideShareDriverSubscription: NonAttribute<RideShareDriverSubscription>;

  @ForeignKey(() => RideShareDriverSubscription)
  @Column(DataType.INTEGER)
  declare rideShareDriverSubscriptionId: NonAttribute<number>;

  @BelongsTo(() => Customer, { onDelete: "cascade" })
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriver, { onDelete: "cascade" })
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;
}
