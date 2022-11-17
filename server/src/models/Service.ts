import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import Subscription from './Subscription';
import ServiceSubscription from './ServiceSubscription';

@Table({
  tableName: 'services',
  timestamps: true,
})
export default class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
  @Column({
    type: DataType.INTEGER,
    field: 'service_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING(3000))
  declare description: string;

  @Column(DataType.STRING)
  declare slug: string;

  @BelongsToMany(() => Subscription, () => ServiceSubscription)
  declare subscriptions: Array<Subscription & { ServiceSubscription: ServiceSubscription }>;
}
