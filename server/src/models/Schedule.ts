import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import TimeSlot from './TimeSlot';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

@Table({
  timestamps: true,

  tableName: 'schedules',
})
export default class Schedule extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'schedule_id' })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.BOOLEAN)
  declare default: boolean;

  @HasMany(() => TimeSlot, { onDelete: 'SET NULL' })
  declare timeSlots: NonAttribute<TimeSlot[]>;
}
