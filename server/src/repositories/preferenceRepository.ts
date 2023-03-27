import CrudRepository from '../helpers/CrudRepository';
import Preference from '../models/Pereference';

export default class PreferenceRepository extends CrudRepository<Preference, number> {
  constructor() {
    super(Preference);
  }
}
