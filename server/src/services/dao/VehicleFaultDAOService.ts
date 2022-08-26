import VehicleFaultRepository from "../../repositories/VehicleFaultRepository";
import VehicleFault from "../../models/VehicleFault";
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

export default class VehicleFaultDAOService implements ICrudDAO<VehicleFault> {
  private carFaultRepository: VehicleFaultRepository;

  constructor(carFaultRepository: VehicleFaultRepository) {
    this.carFaultRepository = carFaultRepository;
  }

  create(
    values: CreationAttributes<VehicleFault>,
    options?: CreateOptions<VehicleFault>
  ): Promise<VehicleFault> {
    return this.carFaultRepository.save(values, options);
  }

  update(
    vehicleFault: VehicleFault,
    values: InferAttributes<VehicleFault>,
    options: UpdateOptions<InferAttributes<VehicleFault>>
  ): Promise<VehicleFault> {
    return this.carFaultRepository.updateOne(vehicleFault, values, options);
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<VehicleFault>>
  ): Promise<VehicleFault | null> {
    return this.carFaultRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<VehicleFault>>
  ): Promise<void> {
    return this.carFaultRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<VehicleFault>>
  ): Promise<VehicleFault | null> {
    return this.carFaultRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<VehicleFault>>
  ): Promise<VehicleFault[]> {
    return this.carFaultRepository.findAll(options);
  }
}
