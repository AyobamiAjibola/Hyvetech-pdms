import CrudRepository from '../helpers/CrudRepository';
import Setting from '../models/Setting';

export default class SettingRepository extends CrudRepository<Setting, number> {
  constructor() {
    super(Setting);
  }
}
