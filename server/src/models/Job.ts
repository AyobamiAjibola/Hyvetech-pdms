import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize/types";
import Vehicle from "./Vehicle";
import { NonAttribute } from "sequelize";
import Technician from "./Technician";
import Partner from "./Partner";
import RideShareDriverSubscription from "./RideShareDriverSubscription";
import CustomerSubscription from "./CustomerSubscription";
import CheckList from "./CheckList";

@Table({ tableName: "jobs", timestamps: true })
export default class Job extends Model<
  InferAttributes<Job>,
  InferCreationAttributes<Job>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "job_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare duration: string;

  @Column(DataType.STRING)
  declare vehicleOwner: string;

  @Column(DataType.DATE)
  declare jobDate: Date;

  @HasOne(() => Vehicle, { onDelete: "cascade" })
  declare vehicle: NonAttribute<Vehicle>;

  @HasOne(() => RideShareDriverSubscription, { onDelete: "cascade" })
  declare rideShareDriverSubscription: NonAttribute<RideShareDriverSubscription>;

  @HasOne(() => CustomerSubscription, { onDelete: "cascade" })
  declare customerSubscription: NonAttribute<CustomerSubscription>;

  @HasMany(() => CheckList)
  declare checkLists: NonAttribute<Array<CheckList>>;

  @BelongsTo(() => Technician, { onDelete: "cascade" })
  declare technician: NonAttribute<Technician>;

  @ForeignKey(() => Technician)
  @Column(DataType.INTEGER)
  declare technicianId: NonAttribute<number>;

  @BelongsTo(() => Partner, { onDelete: "cascade" })
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;
}
