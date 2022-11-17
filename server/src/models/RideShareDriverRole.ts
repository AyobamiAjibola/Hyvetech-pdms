import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Role from './Role';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import RideShareDriver from './RideShareDriver';

@Table({
  timestamps: false,
  tableName: 'ride_share_driver_roles',
})
export default class RideShareDriverRole extends Model<
  InferAttributes<RideShareDriverRole>,
  InferCreationAttributes<RideShareDriverRole>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => RideShareDriver)
  @Column({ type: DataType.INTEGER, field: 'ride_share_driver_id' })
  declare rideShareDriverId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, field: 'role_id' })
  declare roleId: number;
}
