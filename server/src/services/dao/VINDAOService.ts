import VINRepository from "../../repositories/VINRepository";
import VIN from "../../models/VIN";
import { appModelTypes } from "../../@types/app-model";
import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class VINDAOService implements ICrudDAO<VIN> {
  private vinRepository: VINRepository;

  constructor(vinRepository: VINRepository) {
    this.vinRepository = vinRepository;
  }

  create(
    values: CreationAttributes<VIN>,
    options?: CreateOptions<Attributes<VIN>>
  ): Promise<VIN> {
    return this.vinRepository.save(values, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<Attributes<VIN>>
  ): Promise<void> {
    return this.vinRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<VIN>>): Promise<VIN[]> {
    return this.vinRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<VIN>>): Promise<VIN | null> {
    return this.vinRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<VIN>>
  ): Promise<VIN | null> {
    return this.vinRepository.findById(id, options);
  }

  update(
    vin: VIN,
    values: InferAttributes<VIN>,
    options: UpdateOptions<Attributes<VIN>>
  ): Promise<VIN> {
    return this.vinRepository.updateOne(vin, values, options);
  }
}
