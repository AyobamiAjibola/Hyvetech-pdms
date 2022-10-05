import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import JobRepository from "../../repositories/JobRepository";
import Job from "../../models/Job";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class JobDAOService implements ICrudDAO<Job> {
  private readonly jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  create(
    values: CreationAttributes<Job>,
    options?: CreateOptions<Attributes<Job>>
  ): Promise<Job> {
    return this.jobRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Job>): Promise<void> {
    return this.jobRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Job>>): Promise<Job[]> {
    return this.jobRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Job>>): Promise<Job | null> {
    return this.jobRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Job>>
  ): Promise<Job | null> {
    return this.jobRepository.findById(id, options);
  }

  update(
    job: Job,
    values: InferAttributes<Job>,
    options: UpdateOptions<Attributes<Job>>
  ): Promise<Job> {
    return this.jobRepository.updateOne(job, values, options);
  }
}
