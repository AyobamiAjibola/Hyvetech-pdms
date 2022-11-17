import CrudRepository from "../helpers/CrudRepository";
import Transaction from "../models/Transaction";

export default class TransactionRepository extends CrudRepository<Transaction, number> {
  constructor() {
    super(Transaction);
  }
}
