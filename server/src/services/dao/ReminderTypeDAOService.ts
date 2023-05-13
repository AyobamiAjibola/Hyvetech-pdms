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
  import ICrudDAO = appModelTypes.ICrudDAO;
import ReminderType from '../../models/ReminderType';
import ReminderTypeRepository from '../../repositories/ReminderType';

  export default class ReminderTypeDAOService implements ICrudDAO<ReminderType> {
    private reminderTypeRepository: ReminderTypeRepository;

    constructor(reminderTypeRepository: ReminderTypeRepository) {
      this.reminderTypeRepository = reminderTypeRepository;
    }
    create(
      values: Optional<
        InferCreationAttributes<ReminderType, { omit: never }>,
        NullishPropertiesOf<InferCreationAttributes<ReminderType, { omit: never }>>
      >,
      options?: CreateOptions<InferAttributes<ReminderType, { omit: never }>> | undefined,
    ): Promise<ReminderType> {
      return this.reminderTypeRepository.save(values, options);
    }
    update(
      t: ReminderType,
      values: Optional<
        InferCreationAttributes<ReminderType, { omit: never }>,
        NullishPropertiesOf<InferCreationAttributes<ReminderType, { omit: never }>>
      >,
      options?: UpdateOptions<InferAttributes<ReminderType, { omit: never }>> | undefined,
    ): Promise<ReminderType> {
      return this.reminderTypeRepository.updateOne(t, values, options);
    }
    findById(
      id: number,
      options?: FindOptions<InferAttributes<ReminderType, { omit: never }>> | undefined,
    ): Promise<ReminderType | null> {
      return this.reminderTypeRepository.findById(id, options);
    }
    deleteById(
      id: number,
      options?: DestroyOptions<InferAttributes<ReminderType, { omit: never }>> | undefined,
    ): Promise<void> {
      return this.reminderTypeRepository.deleteById(id, options);
    }
    findByAny(options: FindOptions<InferAttributes<ReminderType, { omit: never }>>): Promise<ReminderType | null> {
      return this.reminderTypeRepository.findOne(options);
    }
    findAll(options?: FindOptions<InferAttributes<ReminderType, { omit: never }>> | undefined): Promise<ReminderType[]> {
      return this.reminderTypeRepository.findAll(options);
    }
  }
