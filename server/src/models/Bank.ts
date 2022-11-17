import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';

@Table({
  timestamps: true,
  tableName: 'banks',
})
export default class Bank extends Model<InferAttributes<Bank>, InferCreationAttributes<Bank>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'bank_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
  @Column(DataType.STRING)
  declare slug: string;
  @Column(DataType.STRING)
  declare code: string;
  @Column(DataType.STRING)
  declare longCode: string;
  @Column(DataType.STRING)
  declare gateway: string;
  @Column(DataType.BOOLEAN)
  declare payWithBank: boolean;
  @Column(DataType.BOOLEAN)
  declare active: boolean;
  @Column(DataType.BOOLEAN)
  declare isDeleted: boolean;
  @Column(DataType.STRING)
  declare country: string;
  @Column(DataType.STRING)
  declare currency: string;
  @Column(DataType.STRING)
  declare type: string;
}
