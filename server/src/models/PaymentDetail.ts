import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Customer from './Customer';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import RideShareDriver from './RideShareDriver';

@Table({
  timestamps: true,

  tableName: 'payment_details',
})
export default class PaymentDetail extends Model<
  InferAttributes<PaymentDetail>,
  InferCreationAttributes<PaymentDetail>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'payment_detail_id',
    allowNull: false,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare channel: string;

  @Column(DataType.STRING)
  declare provider: string;

  @Column(DataType.STRING)
  declare bankName: string;

  @Column(DataType.STRING)
  declare bankCode: string;

  @Column(DataType.STRING)
  declare bankAccountNumber: string;

  @Column(DataType.STRING)
  declare ussdCode: string;

  @Column(DataType.STRING)
  declare cardType: string;

  @Column(DataType.STRING)
  declare cardName: string;

  @Column(DataType.STRING)
  declare cardNumber: string;

  @Column(DataType.DATE)
  declare cardExpiryDate: Date;

  @Column(DataType.STRING)
  declare ccv: string;

  @Column(DataType.STRING)
  declare authorizationCode: string;

  @BelongsTo(() => Customer, { onDelete: 'SET NULL' })
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: number;

  @BelongsTo(() => RideShareDriver, { onDelete: 'SET NULL' })
  declare rideShareDriver: NonAttribute<RideShareDriver>;

  @ForeignKey(() => RideShareDriver)
  @Column(DataType.INTEGER)
  declare rideShareDriverId: NonAttribute<number>;
}
