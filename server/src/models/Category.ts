import {
  BelongsToMany,
  Column,
  DataType,
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
import PaymentPlan from "./PaymentPlan";
import PlanCategory from "./PlanCategory";
import PaymentPlanCategory from "./PaymentPlanCategory";
import Partner from "./Partner";
import PartnerCategory from "./PartnerCategory";

@Table({
  tableName: "categories",
  timestamps: true,
})
export default class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @Column({
    type: DataType.INTEGER,
    field: "category_id",
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @BelongsToMany(() => Plan, () => PlanCategory)
  declare plans: NonAttribute<Array<Plan & { PlanCategory: PlanCategory }>>;

  @BelongsToMany(() => Partner, () => PartnerCategory)
  declare partners: NonAttribute<
    Array<Partner & { PartnerCategory: PartnerCategory }>
  >;

  @BelongsToMany(() => PaymentPlan, () => PaymentPlanCategory)
  declare paymentPlans: NonAttribute<
    Array<PaymentPlan & { PaymentPlanCategory: PaymentPlanCategory }>
  >;
}
