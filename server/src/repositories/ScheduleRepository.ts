import CrudRepository from "../helpers/CrudRepository";
import Schedule from "../models/Schedule";

export default class ScheduleRepository extends CrudRepository<Schedule, number> {
  constructor() {
    super(Schedule);
  }
}
