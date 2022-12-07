import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import Customer from './Customer';
import { NonAttribute } from 'sequelize/types';

@Table({
  timestamps: true,
  tableName: 'customer_workshops',
})
export default class CustomerWorkShop extends Model<
  InferAttributes<CustomerWorkShop>,
  InferCreationAttributes<CustomerWorkShop>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'customer_workshop_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare phone: string;

  @BelongsTo(() => Customer)
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: NonAttribute<number>;
}
