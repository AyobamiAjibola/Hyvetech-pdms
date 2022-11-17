import CrudRepository from '../helpers/CrudRepository';
import Role from '../models/Role';

export default class RoleRepository extends CrudRepository<Role, number> {
  constructor() {
    super(Role);
  }
}
