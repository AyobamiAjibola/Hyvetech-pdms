import CrudRepository from '../helpers/CrudRepository';
import Permission from '../models/Permission';

export default class PermissionRepository extends CrudRepository<Permission, number> {
  constructor() {
    super(Permission);
  }
}
