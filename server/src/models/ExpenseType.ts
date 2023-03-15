import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Expense from './Expense';
import Joi from 'joi';

export const expenseTypeFields = {
  name: {
    name: 'name',
    label: 'name',
    error: {
      invalid: 'Name is required',
      required: 'Name is required',
    },
  },
};

export type expenseTypeSchemaType = Attributes<ExpenseType>;

export const $saveExpenseTypeSchema: Joi.SchemaMap<expenseTypeSchemaType> = {
  name: Joi.string().required().label(expenseTypeFields.name.label),
};

@Table({
  tableName: 'expense_type',
  timestamps: true,
  paranoid: true,
})
export default class ExpenseType extends Model<InferAttributes<ExpenseType>, InferCreationAttributes<ExpenseType>> {
  @Column({
    type: DataType.INTEGER,
    field: 'expense_type_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING, unique: true })
  declare name: string;

  @HasMany(() => Expense)
  declare expense: NonAttribute<Expense[]>;
}
