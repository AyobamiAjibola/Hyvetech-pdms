import ScheduleRepository from "../../repositories/ScheduleRepository";
import Schedule from "../../models/Schedule";
import { appModelTypes } from "../../@types/app-model";
import {
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize/types";
import { Attributes } from "sequelize";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ScheduleDAOService implements ICrudDAO<Schedule> {
  private scheduleRepository: ScheduleRepository;

  constructor(scheduleRepository: ScheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  create(
    values: CreationAttributes<Schedule>,
    options?: CreateOptions<Attributes<Schedule>>
  ): Promise<Schedule> {
    return this.scheduleRepository.save(values, options);
  }

  update(
    schedule: Schedule,
    values: InferAttributes<Schedule>,
    options: UpdateOptions<InferAttributes<Schedule>>
  ): Promise<Schedule> {
    return this.scheduleRepository.updateOne(schedule, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<Schedule>>
  ): Promise<Schedule | null> {
    return this.scheduleRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<Schedule>>
  ): Promise<void> {
    return this.scheduleRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<Schedule>>
  ): Promise<Schedule | null> {
    return this.scheduleRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<Schedule>>
  ): Promise<Schedule[]> {
    return this.scheduleRepository.findAll(options);
  }
}
