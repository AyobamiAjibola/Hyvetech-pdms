import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import Vehicle from './Vehicle';
import { NonAttribute } from 'sequelize';
import Technician from './Technician';
import Partner from './Partner';
import RideShareDriverSubscription from './RideShareDriverSubscription';
import CustomerSubscription from './CustomerSubscription';

@Table({ tableName: 'jobs', timestamps: true })
export default class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'job_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare duration: string;

  @Column(DataType.STRING)
  declare vehicleOwner: string;

  @Column(DataType.STRING)
  declare mileageUnit: string;

  @Column(DataType.STRING)
  declare mileageValue: string;

  @Column(DataType.STRING)
  declare frontImageUrl: string;

  @Column(DataType.STRING)
  declare rearImageUrl: string;

  @Column(DataType.STRING)
  declare rightSideImageUrl: string;

  @Column(DataType.STRING)
  declare leftSideImageUrl: string;

  @Column(DataType.STRING)
  declare engineBayImageUrl: string;

  @Column(DataType.STRING)
  declare instrumentClusterImageUrl: string;

  @Column(DataType.DATE)
  declare jobDate: Date;

  @Column(DataType.STRING(50000))
  declare checkList: string;

  @Column(DataType.STRING)
  declare reportFileUrl: string;

  @BelongsTo(() => Technician, { onDelete: 'SET NULL' })
  declare technician: NonAttribute<Technician>;

  @ForeignKey(() => Technician)
  @Column(DataType.INTEGER)
  declare technicianId: NonAttribute<number>;

  @BelongsTo(() => Partner, { onDelete: 'SET NULL' })
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;

  @BelongsTo(() => RideShareDriverSubscription, { onDelete: 'SET NULL' })
  declare rideShareDriverSubscription: NonAttribute<RideShareDriverSubscription>;

  @ForeignKey(() => RideShareDriverSubscription)
  @Column(DataType.INTEGER)
  declare rideShareDriverSubscriptionId: NonAttribute<number>;

  @BelongsTo(() => CustomerSubscription, { onDelete: 'SET NULL' })
  declare customerSubscription: NonAttribute<CustomerSubscription>;

  @ForeignKey(() => CustomerSubscription)
  @Column(DataType.INTEGER)
  declare customerSubscriptionId: NonAttribute<number>;

  @BelongsTo(() => Vehicle, { onDelete: 'SET NULL' })
  declare vehicle: NonAttribute<Vehicle>;

  @ForeignKey(() => Vehicle)
  @Column(DataType.INTEGER)
  declare vehicleId: number;
}
