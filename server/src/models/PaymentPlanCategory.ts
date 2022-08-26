import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import PaymentPlan from "./PaymentPlan";
import Category from "./Category";

@Table({
  tableName: "payment_plan_categories",
  timestamps: false,
})
export default class PaymentPlanCategory extends Model<
  InferAttributes<PaymentPlanCategory>,
  InferCreationAttributes<PaymentPlanCategory>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => PaymentPlan)
  @Column(DataType.INTEGER)
  declare paymentPlanId: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  declare categoryId: number;
}
