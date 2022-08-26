import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Subscription from "./Subscription";
import PaymentPlan from "./PaymentPlan";
import Category from "./Category";
import PlanCategory from "./PlanCategory";

@Table({
  tableName: "plans",
  timestamps: true,
})
export default class Plan extends Model<
  InferAttributes<Plan>,
  InferCreationAttributes<Plan>
> {
  @Column({
    type: DataType.INTEGER,
    field: "plan_id",
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.SMALLINT)
  declare minVehicles: number;

  @Column(DataType.SMALLINT)
  declare maxVehicles: number;

  @Column(DataType.INTEGER)
  declare inspections: number;

  @Column(DataType.INTEGER)
  declare mobile: number;

  @Column(DataType.INTEGER)
  declare driveIn: number;

  @Column(DataType.STRING)
  declare validity: string;

  @BelongsTo(() => Subscription)
  declare subscriptions: Subscription;

  @ForeignKey(() => Subscription)
  @Column(DataType.INTEGER)
  declare subscriptionId: number;

  @HasMany(() => PaymentPlan)
  declare paymentPlans: PaymentPlan[];

  @BelongsToMany(() => Category, () => PlanCategory)
  declare categories: NonAttribute<
    Array<Category & { PlanCategory: PlanCategory }>
  >;
}
