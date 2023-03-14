import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Beneficiary from './Beneficiary';
import ExpenseCategory from './ExpenseCategory';
import ExpenseType from './ExpenseType';
import Invoice from './Invoice';

export type expenseType = 'PAID' | 'UNPAID';

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

  @Column(DataType.DATE)
  declare date: string;

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
}
