import CrudRepository from '../helpers/CrudRepository';
import ExpenseType from '../models/ExpenseType';

export default class ExpenseTypeRepository extends CrudRepository<ExpenseType, number> {
  constructor() {
    super(ExpenseType);
  }
}
