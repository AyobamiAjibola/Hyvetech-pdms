import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { NonAttribute } from 'sequelize';
import Estimate from './Estimate';
import Transaction from './Transaction';

@Table({ tableName: 'invoices', timestamps: true })
export default class Invoice extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'invoice_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare purpose: string;

  @Column(DataType.DOUBLE)
  declare grandTotal: number;

  @Column(DataType.DOUBLE)
  declare depositAmount: number;

  @Column(DataType.DOUBLE)
  declare dueAmount: number;

  @Column(DataType.DATE)
  declare dueDate: Date;

  @Column(DataType.ARRAY(DataType.JSONB))
  declare parts: string[];

  @Column(DataType.ARRAY(DataType.JSONB))
  declare labours: string[];

  @Column(DataType.DOUBLE)
  declare partsTotal: number;

  @Column(DataType.DOUBLE)
  declare laboursTotal: number;

  @Column(DataType.STRING)
  declare tax: string;

  @Column(DataType.INTEGER)
  declare jobDurationValue: number;

  @Column(DataType.STRING)
  declare jobDurationUnit: string;

  @Column(DataType.STRING)
  declare address: string;

  @Column(DataType.STRING)
  declare addressType: string;

  @Column({ type: DataType.INTEGER })
  declare expiresIn: number;

  @Column(DataType.STRING)
  declare url: string;

  @Column(DataType.BOOLEAN)
  declare edited: boolean;

  @HasMany(() => Transaction)
  declare transactions: NonAttribute<Transaction[]>;

  @BelongsTo(() => Estimate, { onDelete: 'cascade' })
  declare estimate: NonAttribute<Estimate>;

  @ForeignKey(() => Estimate)
  @Column(DataType.INTEGER)
  declare estimateId: NonAttribute<number>;
}
