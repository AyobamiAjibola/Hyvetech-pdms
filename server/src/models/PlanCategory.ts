import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import Category from "./Category";
import Plan from "./Plan";

@Table({
  tableName: "plan_categories",
  timestamps: false,
})
export default class PlanCategory extends Model<InferAttributes<PlanCategory>, InferCreationAttributes<PlanCategory>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Plan)
  @Column(DataType.INTEGER)
  declare planId: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  declare categoryId: number;
}
