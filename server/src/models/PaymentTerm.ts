import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  timestamps: true,

  tableName: 'payment_terms',
})
export default class PaymentTerm extends Model<InferAttributes<PaymentTerm>, InferCreationAttributes<PaymentTerm>> {
  @Column({
    type: DataType.INTEGER,
    field: 'payment_term_id',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.INTEGER)
  declare interest: number;

  @Column(DataType.INTEGER)
  declare split: number;

  @Column(DataType.INTEGER)
  declare discount: number;

  @Column(DataType.STRING)
  declare quota: string;
}
