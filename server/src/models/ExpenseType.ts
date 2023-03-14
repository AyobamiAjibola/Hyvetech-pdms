import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Expense from './Expense';

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
