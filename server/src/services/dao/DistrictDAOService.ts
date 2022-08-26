import DistrictRepository from "../../repositories/DistrictRepository";
import District from "../../models/District";
import { appModelTypes } from "../../@types/app-model";
import {
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize/types";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class DistrictDAOService implements ICrudDAO<District> {
  private districtRepository: DistrictRepository;

  constructor(districtRepository: DistrictRepository) {
    this.districtRepository = districtRepository;
  }

  create(
    values: CreationAttributes<District>,
    options?: CreateOptions<District>
  ): Promise<District> {
    return this.districtRepository.save(values, options);
  }

  update(
    district: District,
    values: InferAttributes<District>,
    options: UpdateOptions<InferAttributes<District>>
  ): Promise<District> {
    return this.districtRepository.updateOne(district, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<District>>
  ): Promise<District | null> {
    return this.districtRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<District>>
  ): Promise<void> {
    return this.districtRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<District>>
  ): Promise<District | null> {
    return this.districtRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<District>>
  ): Promise<District[]> {
    return this.districtRepository.findAll(options);
  }
}
