import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'tracker_wait_lists',
})
export default class TrackerWaitList extends Model<
  InferAttributes<TrackerWaitList>,
  InferCreationAttributes<TrackerWaitList>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'tracker_wait_list_id' })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare email: string;
}
