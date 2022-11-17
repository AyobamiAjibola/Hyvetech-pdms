import TimeSlotRepository from '../../repositories/TimeSlotRepository';
import TimeSlot from '../../models/TimeSlot';
import { appModelTypes } from '../../@types/app-model';
import {
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize/types';
import { Attributes } from 'sequelize';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class TimeSlotDAOService implements ICrudDAO<TimeSlot> {
  private timeSlotRepository: TimeSlotRepository;

  constructor(timeSlotRepository: TimeSlotRepository) {
    this.timeSlotRepository = timeSlotRepository;
  }

  create(values: CreationAttributes<TimeSlot>, options?: CreateOptions<Attributes<TimeSlot>>): Promise<TimeSlot> {
    return this.timeSlotRepository.save(values, options);
  }

  update(
    timeSlot: TimeSlot,
    values: InferAttributes<TimeSlot>,
    options: UpdateOptions<InferAttributes<TimeSlot>>,
  ): Promise<TimeSlot> {
    return this.timeSlotRepository.updateOne(timeSlot, values, options);
  }

  findById(id: number, options?: FindOptions<InferAttributes<TimeSlot>>): Promise<TimeSlot | null> {
    return this.timeSlotRepository.findById(id, options);
  }

  deleteById(id: number, options?: DestroyOptions<InferAttributes<TimeSlot>>): Promise<void> {
    return this.timeSlotRepository.deleteById(id, options);
  }

  findByAny(options: FindOptions<InferAttributes<TimeSlot>>): Promise<TimeSlot | null> {
    return this.timeSlotRepository.findOne(options);
  }

  findAll(options?: FindOptions<InferAttributes<TimeSlot>>): Promise<TimeSlot[]> {
    return this.timeSlotRepository.findAll(options);
  }
}
