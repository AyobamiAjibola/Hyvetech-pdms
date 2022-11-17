import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import Partner from './Partner';

import Technician from './Technician';

@Table({
  timestamps: false,
  tableName: 'partner_technicians',
})
export default class PartnerTechnician extends Model<
  InferAttributes<PartnerTechnician>,
  InferCreationAttributes<PartnerTechnician>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.INTEGER })
  declare partnerId: number;

  @ForeignKey(() => Technician)
  @Column({ type: DataType.INTEGER })
  declare technicianId: number;
}
