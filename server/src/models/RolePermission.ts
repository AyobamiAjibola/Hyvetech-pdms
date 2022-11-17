import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import Role from "./Role";
import Permission from "./Permission";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: false,
  tableName: "role_permissions",
})
export default class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, field: "role_id" })
  declare roleId: number;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER, field: "permission_id" })
  declare permissionId: number;
}
