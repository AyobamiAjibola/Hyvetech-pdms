import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import Service from './Service';
import Subscription from './Subscription';

@Table({
  tableName: 'service_subscriptions',
  timestamps: false,
})
export default class ServiceSubscription extends Model<
  InferAttributes<ServiceSubscription>,
  InferCreationAttributes<ServiceSubscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Service)
  @Column(DataType.INTEGER)
  declare serviceId: number;

  @ForeignKey(() => Subscription)
  @Column(DataType.INTEGER)
  declare subscriptionId: number;
}
