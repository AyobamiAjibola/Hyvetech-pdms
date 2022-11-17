import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Role from './Role';
import RolePermission from './RolePermission';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

@Table({
  timestamps: true,

  tableName: 'permissions',
})
export default class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'permission_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
  @Column(DataType.STRING)
  declare action: string;
  @Column(DataType.STRING)
  declare subject: string;
  @Column(DataType.BOOLEAN)
  declare inverted: boolean;

  @BelongsToMany(() => Role, () => RolePermission)
  declare roles: NonAttribute<Array<Role & { RolePermission: RolePermission }>>;
}
