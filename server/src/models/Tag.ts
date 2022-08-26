import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize/types";
import Vehicle from "./Vehicle";
import VehicleTag from "./VehicleTag";

@Table({ tableName: "tags", timestamps: true })
export default class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "tag_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @BelongsToMany(() => Vehicle, () => VehicleTag)
  declare vehicles: NonAttribute<Array<Vehicle & { VehicleTag: VehicleTag }>>;
}
