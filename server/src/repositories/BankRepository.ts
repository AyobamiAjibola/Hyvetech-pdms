import CrudRepository from "../helpers/CrudRepository";
import Bank from "../models/Bank";

export default class BankRepository extends CrudRepository<Bank, number> {
  constructor() {
    super(Bank);
  }
}
