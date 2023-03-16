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
import ExpenseType from '../../models/ExpenseType';
import ExpenseTypeRepository from '../../repositories/ExpenseTypeRepository';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ExpenseTypeDAOService implements ICrudDAO<ExpenseType> {
  private expenseTypeRepository: ExpenseTypeRepository;

  constructor(expenseTypeRepository: ExpenseTypeRepository) {
    this.expenseTypeRepository = expenseTypeRepository;
  }
  create(
    values: Optional<
      InferCreationAttributes<ExpenseType, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<ExpenseType, { omit: never }>>
    >,
    options?: CreateOptions<InferAttributes<ExpenseType, { omit: never }>> | undefined,
  ): Promise<ExpenseType> {
    return this.expenseTypeRepository.save(values, options);
  }
  update(
    t: ExpenseType,
    values: Optional<
      InferCreationAttributes<ExpenseType, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<ExpenseType, { omit: never }>>
    >,
    options?: UpdateOptions<InferAttributes<ExpenseType, { omit: never }>> | undefined,
  ): Promise<ExpenseType> {
    return this.expenseTypeRepository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?: FindOptions<InferAttributes<ExpenseType, { omit: never }>> | undefined,
  ): Promise<ExpenseType | null> {
    return this.expenseTypeRepository.findById(id, options);
  }
  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<ExpenseType, { omit: never }>> | undefined,
  ): Promise<void> {
    return this.expenseTypeRepository.deleteById(id, options);
  }
  findByAny(options: FindOptions<InferAttributes<ExpenseType, { omit: never }>>): Promise<ExpenseType | null> {
    return this.expenseTypeRepository.findOne(options);
  }
  findAll(options?: FindOptions<InferAttributes<ExpenseType, { omit: never }>> | undefined): Promise<ExpenseType[]> {
    return this.expenseTypeRepository.findAll(options);
  }
}
