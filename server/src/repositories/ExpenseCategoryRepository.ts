import CrudRepository from '../helpers/CrudRepository';
import ExpenseCategory from '../models/ExpenseCategory';

export default class ExpenseCategoryRepository extends CrudRepository<ExpenseCategory, number> {
  constructor() {
    super(ExpenseCategory);
  }
}
