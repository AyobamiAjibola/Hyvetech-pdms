import RideShareDriverRepository from "../../repositories/RideShareDriverRepository";
import RideShareDriver from "../../models/RideShareDriver";
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

export default class RideShareDriverDAOService
  implements ICrudDAO<RideShareDriver>
{
  private rideShareDriverRepository: RideShareDriverRepository;

  constructor(rideShareDriverRepository: RideShareDriverRepository) {
    this.rideShareDriverRepository = rideShareDriverRepository;
  }

  create(
    values: CreationAttributes<RideShareDriver>,
    options?: CreateOptions<Attributes<RideShareDriver>>
  ): Promise<RideShareDriver> {
    return this.rideShareDriverRepository.save(values, options);
  }

  update(
    district: RideShareDriver,
    values: InferAttributes<RideShareDriver>,
    options: UpdateOptions<InferAttributes<RideShareDriver>>
  ): Promise<RideShareDriver> {
    return this.rideShareDriverRepository.updateOne(district, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<RideShareDriver>>
  ): Promise<RideShareDriver | null> {
    return this.rideShareDriverRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<RideShareDriver>>
  ): Promise<void> {
    return this.rideShareDriverRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<RideShareDriver>>
  ): Promise<RideShareDriver | null> {
    return this.rideShareDriverRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<RideShareDriver>>
  ): Promise<RideShareDriver[]> {
    return this.rideShareDriverRepository.findAll(options);
  }
}
