import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Attributes, NonAttribute } from 'sequelize';
import Estimate, { estimateFields } from './Estimate';
import Transaction from './Transaction';
import Joi from 'joi';
import DraftInvoice from './DraftInvoice';
import Expense from './Expense';

export type InvoiceSchemaType = Attributes<Invoice>;

export const $sendInvoiceSchema: Joi.SchemaMap<InvoiceSchemaType> = {
  id: Joi.number().required().label('Invoice Id'),
  address: Joi.string().required().label(estimateFields.address.label),
  addressType: Joi.string().required().label(estimateFields.addressType.label),
  parts: Joi.array().required().label(estimateFields.parts.label),
  partsTotal: Joi.number().required().label(estimateFields.partsTotal.label),
  labours: Joi.array().required().label(estimateFields.labours.label),
  tax: Joi.any().optional().label(estimateFields.tax.label),
  taxPart: Joi.any().optional().label(estimateFields.tax.label),
  laboursTotal: Joi.number().required().label(estimateFields.laboursTotal.label),
  grandTotal: Joi.number().required().label(estimateFields.firstName.label),
  depositAmount: Joi.string().required().label(estimateFields.depositAmount.label),
  paidAmount: Joi.string().allow('').label(estimateFields.paidAmount.label),
  additionalDeposit: Joi.string().allow('').label(estimateFields.additionalDeposit.label),
  refundable: Joi.number().allow().label('Funds to Refund'),
  jobDurationValue: Joi.string().required().label(estimateFields.jobDurationValue.label),
  jobDurationUnit: Joi.string().required().label(estimateFields.jobDurationUnit.label),
  dueAmount: Joi.number().allow().label('Due Amount'),
  discount: Joi.number().label('discount'),
  discountType: Joi.string().label('discountType'),
  note: Joi.string().allow('').label('note'),
  internalNote: Joi.string().optional().allow('').label('note'),
};

export const $saveInvoiceSchema: Joi.SchemaMap<InvoiceSchemaType> = {
  id: Joi.number().required().label('Invoice Id'),
  address: Joi.string().allow('').label(estimateFields.address.label),
  addressType: Joi.string().allow('').label(estimateFields.addressType.label),
  parts: Joi.array().allow().label(estimateFields.parts.label),
  partsTotal: Joi.number().allow().label(estimateFields.partsTotal.label),
  labours: Joi.array().allow().label(estimateFields.labours.label),
  tax: Joi.any().allow('').optional().label(estimateFields.tax.label),
  taxPart: Joi.any().allow('').optional().label(estimateFields.taxPart.label),
  laboursTotal: Joi.number().allow().label(estimateFields.laboursTotal.label),
  grandTotal: Joi.number().allow().label(estimateFields.firstName.label),
  depositAmount: Joi.string().allow('').label(estimateFields.depositAmount.label),
  paidAmount: Joi.string().allow('').label(estimateFields.paidAmount.label),
  additionalDeposit: Joi.string().allow('').label(estimateFields.additionalDeposit.label),
  refundable: Joi.number().allow().label('Refund'),
  jobDurationValue: Joi.string().allow('').label(estimateFields.jobDurationValue.label),
  jobDurationUnit: Joi.string().allow('').label(estimateFields.jobDurationUnit.label),
  dueAmount: Joi.number().allow().label('Due Amount'),
  discount: Joi.number().label('discount'),
  discountType: Joi.string().label('discountType'),
  note: Joi.string().allow('').label('note'),
  internalNote: Joi.string().optional().label('internalNote'),
};

@Table({ tableName: 'invoices', timestamps: true, paranoid: true })
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

  @Column(DataType.STRING)
  declare internalNote?: string;

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

  @Column(DataType.INTEGER)
  declare discount?: number;

  @Column(DataType.STRING)
  declare discountType?: string;

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

  @Column(DataType.STRING)
  declare note: string;

  @HasMany(() => Transaction)
  declare transactions: NonAttribute<Transaction[]>;

  @HasMany(() => Expense)
  declare expenses: NonAttribute<Expense[]>;

  @HasOne(() => DraftInvoice)
  declare draftInvoice: NonAttribute<DraftInvoice>;

  @BelongsTo(() => Estimate, { onDelete: 'CASCADE' })
  declare estimate: NonAttribute<Estimate>;

  @ForeignKey(() => Estimate)
  @Column(DataType.INTEGER)
  declare estimateId: NonAttribute<number>;
}
