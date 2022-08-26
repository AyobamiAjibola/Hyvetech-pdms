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
import Appointment from "./Appointment";
import AppointmentJob from "./AppointmentJob";

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
  declare duration: string;

  @BelongsToMany(() => Appointment, () => AppointmentJob)
  declare appointments: NonAttribute<
    Array<Appointment & { BookingJob: AppointmentJob }>
  >;
}
