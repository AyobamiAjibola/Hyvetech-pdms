import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Discount from './Discount';
import DistrictDiscount from './DistrictDiscount';
import State from './State';

@Table({
  timestamps: true,

  tableName: 'districts',
})
export default class District extends Model<InferAttributes<District>, InferCreationAttributes<District>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'district_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @BelongsToMany(() => Discount, () => DistrictDiscount)
  declare discounts: NonAttribute<Array<Discount & { DistrictDiscount: DistrictDiscount }>>;

  @BelongsTo(() => State, { onDelete: 'SET NULL' })
  declare state: NonAttribute<State>;

  @ForeignKey(() => State)
  @Column(DataType.INTEGER)
  declare stateId: number;
}
