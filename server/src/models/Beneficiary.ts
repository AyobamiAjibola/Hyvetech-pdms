import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

@Table({
  tableName: 'beneficiaries',
  timestamps: true,
})
export default class Beneficiary extends Model<InferAttributes<Beneficiary>, InferCreationAttributes<Beneficiary>> {
  @Column({
    type: DataType.INTEGER,
    field: 'beneficiary_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
  @Column(DataType.STRING)
  declare accountNumber: string;
  @Column(DataType.STRING)
  declare bankName: string;
  @Column(DataType.STRING)
  declare accountName: string;
}
