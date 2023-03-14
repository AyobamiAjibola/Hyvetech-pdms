import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Expense from './Expense';

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
