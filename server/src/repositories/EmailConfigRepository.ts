import CrudRepository from '../helpers/CrudRepository';
import EmailConfig from '../models/EmailConfig';

export default class EmailConfigRepository extends CrudRepository<EmailConfig, number> {
  constructor() {
    super(EmailConfig);
  }
}
