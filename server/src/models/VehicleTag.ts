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
import Vehicle from "./Vehicle";
import Tag from "./Tag";

@Table({
  timestamps: false,
  tableName: "vehicle_tags",
})
export default class VehicleTag extends Model<
  InferAttributes<VehicleTag>,
  InferCreationAttributes<VehicleTag>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Vehicle)
  @Column({ type: DataType.INTEGER })
  declare vehicleId: number;

  @ForeignKey(() => Tag)
  @Column({ type: DataType.INTEGER })
  declare tagId: number;
}
