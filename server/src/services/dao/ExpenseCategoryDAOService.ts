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
import ExpenseCategory from '../../models/ExpenseCategory';
import ExpenseCategoryRepository from '../../repositories/ExpenseCategoryRepository';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ExpenseCategoryDAOService implements ICrudDAO<ExpenseCategory> {
  private expenseCategoryRespository: ExpenseCategoryRepository;
  constructor(expenseCategoryRepository: ExpenseCategoryRepository) {
    this.expenseCategoryRespository = expenseCategoryRepository;
  }
  create(
    values: Optional<
      InferCreationAttributes<ExpenseCategory, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<ExpenseCategory, { omit: never }>>
    >,
    options?: CreateOptions<InferAttributes<ExpenseCategory, { omit: never }>> | undefined,
  ): Promise<ExpenseCategory> {
    return this.expenseCategoryRespository.save(values, options);
  }
  update(
    t: ExpenseCategory,
    values: Optional<
      InferCreationAttributes<ExpenseCategory, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<ExpenseCategory, { omit: never }>>
    >,
    options?: UpdateOptions<InferAttributes<ExpenseCategory, { omit: never }>> | undefined,
  ): Promise<ExpenseCategory> {
    return this.expenseCategoryRespository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?: FindOptions<InferAttributes<ExpenseCategory, { omit: never }>> | undefined,
  ): Promise<ExpenseCategory | null> {
    return this.expenseCategoryRespository.findById(id, options);
  }
  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<ExpenseCategory, { omit: never }>> | undefined,
  ): Promise<void> {
    return this.expenseCategoryRespository.deleteById(id, options);
  }
  findByAny(options: FindOptions<InferAttributes<ExpenseCategory, { omit: never }>>): Promise<ExpenseCategory | null> {
    return this.expenseCategoryRespository.findOne(options);
  }
  findAll(
    options?: FindOptions<InferAttributes<ExpenseCategory, { omit: never }>> | undefined,
  ): Promise<ExpenseCategory[]> {
    return this.expenseCategoryRespository.findAll(options);
  }
}
