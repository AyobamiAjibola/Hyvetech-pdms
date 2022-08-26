import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Appointment from "./Appointment";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import Job from "./Job";

@Table({
  timestamps: false,
  tableName: "appointment_jobs",
})
export default class AppointmentJob extends Model<
  InferAttributes<AppointmentJob>,
  InferCreationAttributes<AppointmentJob>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: number;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.INTEGER })
  declare appointmentId: number;

  @ForeignKey(() => Job)
  @Column({ type: DataType.INTEGER })
  declare jobId: number;
}
