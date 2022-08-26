import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import VehicleFault from "./VehicleFault";
import Customer from "./Customer";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Job from "./Job";
import Vehicle from "./Vehicle";
import AppointmentJob from "./AppointmentJob";
import Joi from "joi";

export const $rescheduleSchema = {
  id: Joi.number().required().label("Appointment Id"),
  customerId: Joi.number().required().label("Customer Id"),
  time: Joi.date().iso().required().label("Appointment Date"),
  timeSlot: Joi.string().allow("").label("Time Slot"),
  location: Joi.string().allow("").label("Location"),
  vehicleFault: Joi.string().allow("").label("Vehicle Fault"),
  planCategory: Joi.string().allow("").label("Plan Category"),
  image: Joi.string().allow("").label("Vehicle Fault Image"),
  video: Joi.string().allow("").label("Vehicle Fault Video"),
};

export const $cancelSchema = {
  id: Joi.number().required().label("Appointment Id"),
  customerId: Joi.number().required().label("Customer Id"),
};

@Table({
  timestamps: true,
  tableName: "appointments",
})
export default class Appointment extends Model<
  InferAttributes<Appointment>,
  InferCreationAttributes<Appointment>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "appointment_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.DATE)
  declare appointmentDate: Date;

  @Column(DataType.STRING)
  declare serviceLocation: string;

  @Column(DataType.STRING)
  declare timeSlot: string;

  @Column(DataType.STRING)
  declare planCategory: string;

  @Column(DataType.STRING)
  declare modeOfService: string;

  @Column(DataType.STRING)
  declare programme: string;

  @Column(DataType.STRING)
  declare serviceCost: string;

  @Column(DataType.STRING)
  declare inventoryFile: string;

  @Column(DataType.STRING)
  declare reportFile: string;

  @Column(DataType.STRING)
  declare estimateFile: string;

  @HasOne(() => Vehicle)
  declare vehicle: NonAttribute<Vehicle>;

  @HasOne(() => VehicleFault)
  declare vehicleFault: NonAttribute<VehicleFault>;

  @BelongsTo(() => Customer)
  declare customer: NonAttribute<Customer>;

  @ForeignKey(() => Customer)
  @Column(DataType.INTEGER)
  declare customerId: number;

  @BelongsToMany(() => Job, () => AppointmentJob)
  declare jobs: NonAttribute<Array<Job & { BookingJob: AppointmentJob }>>;

  // @AfterBulkCreate
  // @AfterCreate
  // public static async countAppointmentsPerDay(): Promise<NonAttribute<void>> {
  //   const date = moment(now());
  //
  //   const startTime = date.startOf("day").toDate();
  //   const endTime = date.endOf("day").toDate();
  //
  //   const bookings = await Appointment.findAll({
  //     where: {
  //       createdAt: {
  //         [Op.gte]: startTime,
  //         [Op.lt]: endTime,
  //       },
  //     },
  //     raw: true,
  //   }); //Get all bookings for the day
  //
  //   //If booking exceeds 7, return an error
  //   if (bookings.length > 7) throw new Error("Maximum bookings exceeded!");
  //
  //   //Cache the number in redis datastore. Overwrite each value in the datastore.
  //   await dataStore.setEx(BOOKINGS, bookings.length.toString(), {
  //     PX: TWENTY_FOUR_HOUR_EXPIRY,
  //   });
  // }
}
