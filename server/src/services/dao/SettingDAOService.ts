import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import SettingRepository from '../../repositories/SettingRepository';
import Setting from '../../models/Setting';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class SettingDAOService implements ICrudDAO<Setting> {
  private readonly settingRepository: SettingRepository;

  constructor(settingRepository: SettingRepository) {
    this.settingRepository = settingRepository;
  }

  create(values: CreationAttributes<Setting>, options?: CreateOptions<Attributes<Setting>>): Promise<Setting> {
    return this.settingRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Setting>): Promise<void> {
    return this.settingRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Setting>>): Promise<Setting[]> {
    return this.settingRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Setting>>): Promise<Setting | null> {
    return this.settingRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Setting>>): Promise<Setting | null> {
    return this.settingRepository.findById(id, options);
  }

  update(
    appointment: Setting,
    values: InferAttributes<Setting>,
    options: UpdateOptions<Attributes<Setting>>,
  ): Promise<Setting> {
    return this.settingRepository.updateOne(appointment, values, options);
  }
}
