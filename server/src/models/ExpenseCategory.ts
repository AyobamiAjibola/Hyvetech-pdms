import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

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
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
}
