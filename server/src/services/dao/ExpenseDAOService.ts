import {
  Optional,
  InferCreationAttributes,
  CreateOptions,
  InferAttributes,
  UpdateOptions,
  FindOptions,
  DestroyOptions,
} from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { appModelTypes } from '../../@types/app-model';
import Expense from '../../models/Expense';
import ExpenseRepository from '../../repositories/ExpenseRepository';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ExpenseDAOService implements ICrudDAO<Expense> {
  private expenseRepository: ExpenseRepository;

  constructor(expenseRepository: ExpenseRepository) {
    this.expenseRepository = expenseRepository;
  }
  create(
    values: Optional<
      InferCreationAttributes<Expense, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<Expense, { omit: never }>>
    >,
    options?: CreateOptions<InferAttributes<Expense, { omit: never }>> | undefined,
  ): Promise<Expense> {
    return this.expenseRepository.save(values, options);
  }
  update(
    t: Expense,
    values: Optional<
      InferCreationAttributes<Expense, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<Expense, { omit: never }>>
    >,
    options?: UpdateOptions<InferAttributes<Expense, { omit: never }>> | undefined,
  ): Promise<Expense> {
    return this.expenseRepository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?: FindOptions<InferAttributes<Expense, { omit: never }>> | undefined,
  ): Promise<Expense | null> {
    return this.expenseRepository.findById(id, options);
  }
  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<Expense, { omit: never }>> | undefined,
  ): Promise<void> {
    return this.expenseRepository.deleteById(id, options);
  }
  findByAny(options: FindOptions<InferAttributes<Expense, { omit: never }>>): Promise<Expense | null> {
    return this.expenseRepository.findOne(options);
  }
  findAll(options?: FindOptions<InferAttributes<Expense, { omit: never }>> | undefined): Promise<Expense[]> {
    return this.expenseRepository.findAll(options);
  }
}
