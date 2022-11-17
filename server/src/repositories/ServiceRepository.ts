import CrudRepository from '../helpers/CrudRepository';
import Service from '../models/Service';

export default class ServiceRepository extends CrudRepository<Service, number> {
  constructor() {
    super(Service);
  }
}
