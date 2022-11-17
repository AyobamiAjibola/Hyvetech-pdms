import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import RideShareDriver from './RideShareDriver';
import RideShareDriverSubscription from './RideShareDriverSubscription';

@Table({
  timestamps: false,
  tableName: 'ride_share_driver_plan_subscriptions',
})
export default class RideShareDriverPlanSubscription extends Model<
  InferAttributes<RideShareDriverPlanSubscription>,
  InferCreationAttributes<RideShareDriverPlanSubscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => RideShareDriver)
  @Column({ type: DataType.INTEGER })
  declare rideShareDriverId: number;

  @ForeignKey(() => RideShareDriverSubscription)
  @Column({ type: DataType.INTEGER })
  declare rideShareDriverSubscriptionId: number;
}
