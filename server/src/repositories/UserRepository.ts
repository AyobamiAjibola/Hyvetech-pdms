import CrudRepository from "../helpers/CrudRepository";
import User from "../models/User";

export default class UserRepository extends CrudRepository<User, number> {
  constructor() {
    super(User);
  }
}
