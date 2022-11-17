import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import User from './User';
import Role from './Role';

@Table({
  timestamps: false,
  tableName: 'user_roles',
})
export default class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  declare roleId: number;
}
