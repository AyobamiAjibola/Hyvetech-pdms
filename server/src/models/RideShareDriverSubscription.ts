import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Vehicle from './Vehicle';
import RideShareDriver from './RideShareDriver';
import RideShareDriverPlanSubscription from './RideShareDriverPlanSubscription';
import Job from './Job';
import Transaction from './Transaction';

@Table({
  timestamps: true,
  tableName: 'ride_share_driver_subscriptions',
})
export default class RideShareDriverSubscription extends Model<
  InferAttributes<RideShareDriverSubscription>,
  InferCreationAttributes<RideShareDriverSubscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ride_share_driver_subscription_id',
  })
  declare id: number;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare planType: string;

  @Column(DataType.STRING)
  declare planCategory: string;

  @Column(DataType.STRING)
  declare modeOfService: string;

  @Column(DataType.STRING)
  declare paymentPlan: string;

  @Column(DataType.SMALLINT)
  declare maxVehicle: number;

  @Column(DataType.SMALLINT)
  declare vehicleCount: number;

  @Column(DataType.SMALLINT)
  declare minVehicle: number;

  @Column(DataType.BOOLEAN)
  declare isHybrid: boolean;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare mobileCount: number;

  @Column(DataType.SMALLINT)
  declare maxMobile: number;

  @Column({ type: DataType.SMALLINT, defaultValue: 0 })
  declare driveInCount: number;

  @Column(DataType.SMALLINT)
  declare maxDriveIn: number;

  @Column(DataType.SMALLINT)
  declare inspections: number;

  @Column(DataType.STRING)
  declare subscriber: string;

  @Column(DataType.STRING)
  declare amount: string;

  @Column(DataType.STRING)
  declare programme: string;

  @Column(DataType.STRING)
  declare planCode: string;

  @Column(DataType.DATE)
  declare subscriptionDate: Date;

  @Column(DataType.DATE)
  declare nextPaymentDate: Date;

  @BelongsToMany(() => RideShareDriver, () => RideShareDriverPlanSubscription)
  declare rideShareDrivers: NonAttribute<
    Array<
      RideShareDriver & {
        RideShareDriverPlanSubscription: RideShareDriverPlanSubscription;
      }
    >
  >;

  @HasMany(() => Job)
  declare jobs: NonAttribute<Array<Job>>;

  @HasMany(() => Vehicle, { onDelete: 'SET NULL' })
  declare vehicles: NonAttribute<Vehicle[]>;

  @HasOne(() => Transaction, { onDelete: 'SET NULL' })
  declare transaction: NonAttribute<Transaction>;
}
