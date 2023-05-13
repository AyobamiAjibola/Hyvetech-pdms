import {
    Attributes,
    CreateOptions,
    CreationAttributes,
    DestroyOptions,
    FindOptions,
    InferAttributes,
    UpdateOptions,
  } from 'sequelize';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;
import ServiceReminder from '../../models/ServiceReminder';
import ServiceReminderRepository from '../../repositories/ServiceReminder';

  export default class ServiceReminderDAOService implements ICrudDAO<ServiceReminder> {
    private readonly serviceReminderRepository: ServiceReminderRepository;

    constructor(serviceReminderRepository: ServiceReminderRepository) {
      this.serviceReminderRepository = serviceReminderRepository;
    }

    create(values: CreationAttributes<ServiceReminder>, options?: CreateOptions<Attributes<ServiceReminder>>): Promise<ServiceReminder> {
      return this.serviceReminderRepository.save(values, options);
    }

    deleteById(id: number, options?: DestroyOptions<ServiceReminder>): Promise<void> {
      return this.serviceReminderRepository.deleteById(id, options);
    }

    findAll(options?: FindOptions<Attributes<ServiceReminder>>): Promise<ServiceReminder[]> {
      return this.serviceReminderRepository.findAll(options);
    }

    findByAny(options: FindOptions<Attributes<ServiceReminder>>): Promise<ServiceReminder | null> {
      return this.serviceReminderRepository.findOne(options);
    }

    findById(id: number, options?: FindOptions<Attributes<ServiceReminder>>): Promise<ServiceReminder | null> {
      return this.serviceReminderRepository.findById(id, options);
    }

    update(
      serviceReminder: ServiceReminder,
      values: InferAttributes<ServiceReminder>,
      options: UpdateOptions<Attributes<ServiceReminder>>,
    ): Promise<ServiceReminder> {
      return this.serviceReminderRepository.updateOne(serviceReminder, values, options);
    }
  }
