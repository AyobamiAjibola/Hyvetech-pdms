import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import Invoice from './Invoice';
import { NonAttribute } from 'sequelize';

@Table({ tableName: 'draft_invoices', timestamps: true, paranoid: true })
export default class DraftInvoice extends Model<InferAttributes<DraftInvoice>, InferCreationAttributes<DraftInvoice>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'draft_invoice_id', allowNull: false })
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
  declare paidAmount: number;

  @Column(DataType.DOUBLE)
  declare dueAmount: number;

  @Column(DataType.DOUBLE)
  declare additionalDeposit: number;

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

  @Column(DataType.DOUBLE)
  declare refundable: number;

  @Column(DataType.STRING)
  declare updateStatus: string;

  @Column(DataType.STRING)
  declare tax: string;

  @Column(DataType.STRING)
  declare taxPart: string;

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

  @BelongsTo(() => Invoice)
  declare invoice: NonAttribute<Invoice>;

  @ForeignKey(() => Invoice)
  @Column(DataType.INTEGER)
  declare invoiceId: NonAttribute<number>;
}
