import CrudRepository from '../helpers/CrudRepository';
import Job from '../models/Job';

export default class JobRepository extends CrudRepository<Job, number> {
  constructor() {
    super(Job);
  }
}
