import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import Appointment from "./Appointment";
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";

@Table({
  timestamps: true,

  tableName: "vehicle_faults",
})
export default class VehicleFault extends Model<InferAttributes<VehicleFault>, InferCreationAttributes<VehicleFault>> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: "vehicle_fault_id",
    allowNull: false,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare imagePath: string;

  @Column(DataType.STRING)
  declare videoPath: string;

  @BelongsTo(() => Appointment, { onDelete: "cascade" })
  declare appointment: NonAttribute<Appointment>;

  @ForeignKey(() => Appointment)
  @Column(DataType.INTEGER)
  declare appointmentId: number;
}
