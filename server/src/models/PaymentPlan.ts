import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Plan from "./Plan";
import Category from "./Category";
import PaymentPlanCategory from "./PaymentPlanCategory";

@Table({
  tableName: "payment_plans",
  timestamps: true,
})
export default class PaymentPlan extends Model<
  InferAttributes<PaymentPlan>,
  InferCreationAttributes<PaymentPlan>
> {
  @Column({
    type: DataType.INTEGER,
    field: "payment_plan_id",
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.DOUBLE)
  declare value: number;

  @Column(DataType.BOOLEAN)
  declare hasPromo: boolean;

  @Column(DataType.DOUBLE)
  declare discount: number;

  @Column(DataType.ARRAY(DataType.STRING))
  declare descriptions: string[];

  @BelongsTo(() => Plan)
  declare plan: NonAttribute<Plan>;

  @ForeignKey(() => Plan)
  @Column(DataType.INTEGER)
  declare planId: number;

  @BelongsToMany(() => Category, () => PaymentPlanCategory)
  declare categories: NonAttribute<
    Array<Category & { PaymentPlanCategory: PaymentPlanCategory }>
  >;
}