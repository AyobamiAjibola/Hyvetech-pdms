import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { NonAttribute } from 'sequelize';
import Estimate from './Estimate';

@Table({ tableName: 'jobs', timestamps: true })
export default class Invoice extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'job_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.DOUBLE)
  declare grandTotal: number;

  @Column(DataType.DOUBLE)
  declare depositAmount: number;

  @Column(DataType.DOUBLE)
  declare dueAmount: number;

  @BelongsTo(() => Estimate, { onDelete: 'cascade' })
  declare estimate: NonAttribute<Estimate>;

  @ForeignKey(() => Estimate)
  @Column(DataType.INTEGER)
  declare estimateId: NonAttribute<number>;
}
