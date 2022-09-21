import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import User from "./User";
import Partner from "./Partner";

@Table({
  timestamps: false,
  tableName: "partner_users",
})
export default class PartnerUser extends Model<
  InferAttributes<PartnerUser>,
  InferCreationAttributes<PartnerUser>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @ForeignKey(() => Partner)
  @Column({ type: DataType.INTEGER })
  declare partnerId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;
}
