import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Beneficiary from './Beneficiary';
import ExpenseCategory from './ExpenseCategory';
import ExpenseType from './ExpenseType';
import Invoice from './Invoice';
import Joi from 'joi';
import Partner from './Partner';

export const expenseFields = {
  date: {
    name: 'date',
    label: 'date',
    error: {
      invalid: 'Date is required',
      required: 'Date is required',
    },
  },
  reference: {
    name: 'Reference',
    label: 'reference',
    error: {
      invalid: 'Reference is invalid',
      required: 'Reference is required',
    },
  },
  amount: {
    name: 'amount',
    label: 'amount',
    error: {
      invalid: 'Amount is invalid',
      required: 'Amount is required',
    },
  },
  status: {
    name: 'status',
    label: 'status',
    error: {
      invalid: 'Status is invalid',
      required: 'Status is required',
    },
  },
  expenseCategoryId: {
    name: 'Expense Category ID',
    label: 'expenseCategoryId',
    error: {
      invalid: 'Expense Category ID is invalid',
      required: 'Expense Category ID is required',
    },
  },
  expenseTypeId: {
    name: 'Expense Type ID',
    label: 'expenseTypeId',
    error: {
      invalid: 'Expense Type ID is invalid',
      required: 'Expense Type ID is required',
    },
  },
  beneficiaryId: {
    name: 'Beneficiary ID',
    label: 'beneficiaryId',
    error: {
      invalid: 'Beneficiary ID is invalid',
      required: 'Beneficiary ID is required',
    },
  },
  invoiceId: {
    name: 'Invoice ID',
    label: 'invoiceId',
    error: {
      invalid: 'Invoice ID is invalid',
      required: 'Invoice ID is required',
    },
  },
};

export type expenseType = 'PAID' | 'UNPAID';

export type ExpenseSchemaType = Attributes<Expense> & {
  expenseCategoryId: number;
  expenseTypeId: number;
  beneficiaryId: number;
  invoiceId: number;
};

export const $saveExpenseSchema: Joi.SchemaMap<ExpenseSchemaType> = {
  reference: Joi.string().optional().label(expenseFields.reference.label),
  amount: Joi.number().required().label(expenseFields.date.label),
  expenseCategoryId: Joi.number().label(expenseFields.expenseCategoryId.label),
  expenseTypeId: Joi.number().label(expenseFields.expenseTypeId.label),
  beneficiaryId: Joi.number().label(expenseFields.beneficiaryId.label),
  invoiceId: Joi.number().optional().label(expenseFields.invoiceId.label),
};

export const $updateExpenseSchema: Joi.SchemaMap<Expense> = {
  reference: Joi.string().label(expenseFields.reference.label),
  id: Joi.number().required().label('id'),
};

@Table({
  tableName: 'expenses',
  timestamps: true,
  paranoid: true,
})
export default class Expense extends Model<InferAttributes<Expense>, InferCreationAttributes<Expense>> {
  @Column({
    type: DataType.INTEGER,
    field: 'expense_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.INTEGER)
  declare amount: number;

  @Column(DataType.STRING)
  declare reference: string;

  @Column(DataType.STRING)
  declare status: expenseType;

  @BelongsTo(() => Beneficiary)
  declare beneficiary: NonAttribute<Beneficiary>;

  @BelongsTo(() => ExpenseCategory)
  declare category: NonAttribute<ExpenseCategory>;

  @BelongsTo(() => ExpenseType)
  declare type: NonAttribute<ExpenseType>;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @BelongsTo(() => Invoice, { onDelete: 'CASCADE' })
  declare invoice: NonAttribute<Invoice>;

  @ForeignKey(() => Invoice)
  @Column(DataType.INTEGER)
  declare invoiceId: NonAttribute<number>;

  @ForeignKey(() => Beneficiary)
  @Column(DataType.INTEGER)
  declare beneficiaryId: NonAttribute<number>;

  @ForeignKey(() => ExpenseType)
  @Column(DataType.INTEGER)
  declare expenseTypeId: NonAttribute<number>;

  @ForeignKey(() => ExpenseCategory)
  @Column(DataType.INTEGER)
  declare expenseCategoryId: NonAttribute<number>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

  @Column(DataType.STRING)
  declare invoiceCode: string;
}
