import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import EstimateRepository from '../../repositories/EstimateRepository';
import Estimate from '../../models/Estimate';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class EstimateDAOService implements ICrudDAO<Estimate> {
  private readonly estimateRepository: EstimateRepository;

  constructor(estimateRepository: EstimateRepository) {
    this.estimateRepository = estimateRepository;
  }

  create(values: CreationAttributes<Estimate>, options?: CreateOptions<Attributes<Estimate>>): Promise<Estimate> {
    return this.estimateRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Estimate>): Promise<void> {
    return this.estimateRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Estimate>>): Promise<Estimate[]> {
    return this.estimateRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Estimate>>): Promise<Estimate | null> {
    return this.estimateRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Estimate>>): Promise<Estimate | null> {
    return this.estimateRepository.findById(id, options);
  }

  update(
    estimate: Estimate,
    values: InferAttributes<Estimate>,
    options: UpdateOptions<Attributes<Estimate>>,
  ): Promise<Estimate> {
    return this.estimateRepository.updateOne(estimate, values, options);
  }
}
