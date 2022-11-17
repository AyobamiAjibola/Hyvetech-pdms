import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Role from './Role';
import Customer from './Customer';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  timestamps: false,
  tableName: 'customer_roles',
})
export default class CustomerRole extends Model<InferAttributes<CustomerRole>, InferCreationAttributes<CustomerRole>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER, field: 'customer_id' })
  declare customerId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, field: 'role_id' })
  declare roleId: number;
}
