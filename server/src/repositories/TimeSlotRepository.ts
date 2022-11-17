import CrudRepository from '../helpers/CrudRepository';
import TimeSlot from '../models/TimeSlot';

export default class TimeSlotRepository extends CrudRepository<TimeSlot, number> {
  constructor() {
    super(TimeSlot);
  }
}
