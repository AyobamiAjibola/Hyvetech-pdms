import CrudRepository from '../helpers/CrudRepository';
import Expense from '../models/Expense';

export default class ExpenseRepository extends CrudRepository<Expense, number> {
  constructor() {
    super(Expense);
  }
}
