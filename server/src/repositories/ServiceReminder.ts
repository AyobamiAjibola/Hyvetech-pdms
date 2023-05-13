import CrudRepository from '../helpers/CrudRepository';
import ServiceReminder from '../models/ServiceReminder';

export default class ServiceReminderRepository extends CrudRepository<ServiceReminder, number> {
  constructor() {
    super(ServiceReminder);
  }
}