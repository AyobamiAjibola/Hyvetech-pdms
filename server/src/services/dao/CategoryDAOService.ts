import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import CategoryRepository from '../../repositories/CategoryRepository';
import Category from '../../models/Category';
import { appModelTypes } from '../../@types/app-model';
import moment from 'moment/moment';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class CategoryDAOService implements ICrudDAO<Category> {
  private readonly categoryRepository: CategoryRepository;

  private declare readonly startDate;
  private declare readonly endDate;
  private declare readonly year;

  constructor(categoryRepository: CategoryRepository) {
    this.startDate = moment({ hours: 0, minutes: 0, seconds: 0 }).toDate();
    this.endDate = moment({ hours: 23, minutes: 59, seconds: 59 }).toDate();

    this.categoryRepository = categoryRepository;
  }

  create(values: CreationAttributes<Category>, options?: CreateOptions<Attributes<Category>>): Promise<Category> {
    return this.categoryRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Category>): Promise<void> {
    return this.categoryRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Category>>): Promise<Category[]> {
    return this.categoryRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Category>>): Promise<Category | null> {
    return this.categoryRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Category>>): Promise<Category | null> {
    return this.categoryRepository.findById(id, options);
  }

  update(
    category: Category,
    values: InferAttributes<Category>,
    options: UpdateOptions<Attributes<Category>>,
  ): Promise<Category> {
    return this.categoryRepository.updateOne(category, values, options);
  }
}
