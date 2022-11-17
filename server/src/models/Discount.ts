import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize/types";
import DistrictDiscount from "./DistrictDiscount";
import District from "./District";

@Table({
  tableName: "discounts",
  timestamps: true,
})
export default class Discount extends Model<InferAttributes<Discount>, InferCreationAttributes<Discount>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false, field: "discount_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.FLOAT)
  declare value: number;

  @BelongsToMany(() => District, () => DistrictDiscount)
  declare districts: Array<District & { DistrictDiscount: DistrictDiscount }>;
}
