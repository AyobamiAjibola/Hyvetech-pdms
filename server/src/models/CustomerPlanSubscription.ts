import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Customer from "./Customer";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import CustomerSubscription from "./CustomerSubscription";

@Table({
  timestamps: false,
  tableName: "customer_plan_subscriptions",
})
export default class CustomerPlanSubscription extends Model<
  InferAttributes<CustomerPlanSubscription>,
  InferCreationAttributes<CustomerPlanSubscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  declare customerId: number;

  @ForeignKey(() => CustomerSubscription)
  @Column({ type: DataType.INTEGER })
  declare customerSubscriptionId: number;
}
