import CrudRepository from '../helpers/CrudRepository';
import ReminderType from '../models/ReminderType';

export default class ReminderTypeRepository extends CrudRepository<ReminderType, number> {
  constructor() {
    super(ReminderType);
  }
}