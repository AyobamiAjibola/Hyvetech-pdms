import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

import Schedule from './Schedule';

@Table({
  timestamps: true,

  tableName: 'time_slots',
})
export default class TimeSlot extends Model<InferAttributes<TimeSlot>, InferCreationAttributes<TimeSlot>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'time_slot_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare time: string;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.BOOLEAN)
  declare available: boolean;

  @BelongsTo(() => Schedule, { onDelete: 'SET NULL' })
  declare schedule: NonAttribute<Schedule>;

  @ForeignKey(() => Schedule)
  @Column(DataType.INTEGER)
  declare scheduleId: number;
}
