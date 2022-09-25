import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Role from "./Role";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import Technician from "./Technician";

@Table({
  timestamps: false,
  tableName: "technician_roles",
})
export default class TechnicianRole extends Model<
  InferAttributes<TechnicianRole>,
  InferCreationAttributes<TechnicianRole>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Technician)
  @Column({ type: DataType.INTEGER, field: "technician_id" })
  declare technicianId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, field: "role_id" })
  declare roleId: number;
}
