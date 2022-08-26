import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import District from "./District";

@Table({
  timestamps: true,

  tableName: "states",
})
export default class State extends Model<
  InferAttributes<State>,
  InferCreationAttributes<State>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "state_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare alias: string;

  @HasMany(() => District)
  declare districts: NonAttribute<District[]>;
}
