import {
  AutoIncrement,
  BelongsTo,
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
  NonAttribute,
} from "sequelize";
import Partner from "./Partner";
import Job from "./Job";

@Table({
  timestamps: true,
  tableName: "check_lists",
})
export default class CheckList extends Model<
  InferAttributes<CheckList>,
  InferCreationAttributes<CheckList>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "check_list_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  declare sections: Array<string>;

  @Column(DataType.BOOLEAN)
  declare approvedByGarageAdmin: boolean;

  @Column(DataType.BOOLEAN)
  declare isSubmitted: boolean;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;

  @BelongsTo(() => Job)
  declare job: NonAttribute<Job>;

  @ForeignKey(() => Job)
  @Column(DataType.INTEGER)
  declare jobId: NonAttribute<number>;
}
