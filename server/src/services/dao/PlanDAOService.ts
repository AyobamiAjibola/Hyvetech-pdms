import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import PlanRepository from '../../repositories/PlanRepository';
import Plan from '../../models/Plan';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PlanDAOService implements ICrudDAO<Plan> {
  private planRepository: PlanRepository;

  constructor(planRepository: PlanRepository) {
    this.planRepository = planRepository;
  }

  create(values: CreationAttributes<Plan>, options?: CreateOptions<Attributes<Plan>>): Promise<Plan> {
    return this.planRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Plan>): Promise<void> {
    return this.planRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Plan>>): Promise<Plan[]> {
    return this.planRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Plan>>): Promise<Plan | null> {
    return this.planRepository.findOne(options);
  }

  findByName(name: string, options?: FindOptions<Attributes<Plan>>): Promise<Plan | null> {
    return this.planRepository.findOne({
      where: { label: name },
      ...options,
    });
  }

  findById(id: number, options?: FindOptions<Attributes<Plan>>): Promise<Plan | null> {
    return this.planRepository.findById(id, options);
  }

  update(plan: Plan, values: InferAttributes<Plan>, options: UpdateOptions<Attributes<Plan>>): Promise<Plan> {
    return this.planRepository.updateOne(plan, values, options);
  }
}
