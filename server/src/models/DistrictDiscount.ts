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
import District from "./District";
import Discount from "./Discount";

@Table({
  timestamps: false,
  tableName: "district_discounts",
})
export default class DistrictDiscount extends Model<
  InferAttributes<DistrictDiscount>,
  InferCreationAttributes<DistrictDiscount>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => District)
  @Column({ type: DataType.INTEGER })
  declare districtId: number;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.INTEGER })
  declare discountId: number;
}
