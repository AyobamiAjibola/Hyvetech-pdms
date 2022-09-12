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
import Category from "./Category";
import Partner from "./Partner";

@Table({
  tableName: "partner_categories",
  timestamps: false,
})
export default class PartnerCategory extends Model<
  InferAttributes<PartnerCategory>,
  InferCreationAttributes<PartnerCategory>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  declare categoryId: number;
}
