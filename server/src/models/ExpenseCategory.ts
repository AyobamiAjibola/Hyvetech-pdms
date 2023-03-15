import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Expense from './Expense';
import Joi from 'joi';

export const expenseCategoryFields = {
  name: {
    name: 'name',
    label: 'name',
    error: {
      invalid: 'Name is required',
      required: 'Name is required',
    },
  },
};
export type expenseCategorySchemaType = Attributes<ExpenseCategory>;

export const $saveExpenseCategorySchema: Joi.SchemaMap<expenseCategorySchemaType> = {
  name: Joi.string().required().label(expenseCategoryFields.name.label),
};

@Table({
  tableName: 'expense_category',
  timestamps: true,
})
export default class ExpenseCategory extends Model<
  InferAttributes<ExpenseCategory>,
  InferCreationAttributes<ExpenseCategory>
> {
  @Column({
    type: DataType.INTEGER,
    field: 'expense_category_id',
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING, unique: true })
  declare name: string;

  @HasMany(() => Expense)
  declare expense: NonAttribute<Expense[]>;
}
