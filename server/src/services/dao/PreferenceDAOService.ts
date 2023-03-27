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
import Preference from '../../models/Pereference';
import PreferenceRepository from '../../repositories/preferenceRepository';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PreferenceDAOService implements ICrudDAO<Preference> {
  private preferenceRepository: PreferenceRepository;
  constructor(repo: PreferenceRepository) {
    this.preferenceRepository = repo;
  }
  create(
    values: Optional<
      InferCreationAttributes<Preference, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<Preference, { omit: never }>>
    >,
    options?: CreateOptions<InferAttributes<Preference, { omit: never }>> | undefined,
  ): Promise<Preference> {
    return this.preferenceRepository.save(values, options);
  }
  update(
    t: Preference,
    values: Optional<
      InferCreationAttributes<Preference, { omit: never }>,
      NullishPropertiesOf<InferCreationAttributes<Preference, { omit: never }>>
    >,
    options?: UpdateOptions<InferAttributes<Preference, { omit: never }>> | undefined,
  ): Promise<Preference> {
    return this.preferenceRepository.updateOne(t, values, options);
  }
  findById(
    id: number,
    options?: FindOptions<InferAttributes<Preference, { omit: never }>> | undefined,
  ): Promise<Preference | null> {
    return this.preferenceRepository.findById(id, options);
  }
  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<Preference, { omit: never }>> | undefined,
  ): Promise<void> {
    return this.preferenceRepository.deleteById(id, options);
  }
  findByAny(options: FindOptions<InferAttributes<Preference, { omit: never }>>): Promise<Preference | null> {
    return this.preferenceRepository.findOne(options);
  }
  findAll(options?: FindOptions<InferAttributes<Preference, { omit: never }>> | undefined): Promise<Preference[]> {
    return this.preferenceRepository.findAll(options);
  }
}
