import CrudRepository from "../helpers/CrudRepository";
import Appointment from "../models/Appointment";

export default class AppointmentRepository extends CrudRepository<Appointment, number> {
  constructor() {
    super(Appointment);
  }
}
