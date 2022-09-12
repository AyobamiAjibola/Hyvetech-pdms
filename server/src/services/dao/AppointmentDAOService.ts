import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import AppointmentRepository from "../../repositories/AppointmentRepository";
import Appointment from "../../models/Appointment";
import { appModelTypes } from "../../@types/app-model";
import moment from "moment/moment";
import Generic from "../../utils/Generic";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class AppointmentDAOService implements ICrudDAO<Appointment> {
  private readonly appointmentRepository: AppointmentRepository;

  private declare readonly startDate;
  private declare readonly endDate;
  private declare readonly year;

  constructor(appointmentRepository: AppointmentRepository) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

    this.appointmentRepository = appointmentRepository;
  }

  create(
    values: CreationAttributes<Appointment>,
    options?: CreateOptions<Attributes<Appointment>>
  ): Promise<Appointment> {
    return this.appointmentRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Appointment>): Promise<void> {
    return this.appointmentRepository.deleteById(id, options);
  }

  findAll(
    options?: FindOptions<Attributes<Appointment>>
  ): Promise<Appointment[]> {
    return this.appointmentRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<Appointment>>
  ): Promise<Appointment | null> {
    return this.appointmentRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Appointment>>
  ): Promise<Appointment | null> {
    return this.appointmentRepository.findById(id, options);
  }

  update(
    appointment: Appointment,
    values: InferAttributes<Appointment>,
    options: UpdateOptions<Attributes<Appointment>>
  ): Promise<Appointment> {
    return this.appointmentRepository.updateOne(appointment, values, options);
  }

  public async getTotalDailyAppointments() {
    return Generic.getDailyData(this.appointmentRepository);
  }

  public async getTotalMonthlyAppointments() {
    return Generic.getMonthlyData(this.appointmentRepository);
  }
}
