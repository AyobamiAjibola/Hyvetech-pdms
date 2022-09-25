import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import TechnicianRepository from "../../repositories/TechnicianRepository";
import Technician from "../../models/Technician";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class TechnicianDAOService implements ICrudDAO<Technician> {
  private readonly technicianRepository: TechnicianRepository;

  constructor(technicianRepository: TechnicianRepository) {
    this.technicianRepository = technicianRepository;
  }

  create(
    values: CreationAttributes<Technician>,
    options?: CreateOptions<Attributes<Technician>>
  ): Promise<Technician> {
    return this.technicianRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Technician>): Promise<void> {
    return this.technicianRepository.deleteById(id, options);
  }

  findAll(
    options?: FindOptions<Attributes<Technician>>
  ): Promise<Technician[]> {
    return this.technicianRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<Technician>>
  ): Promise<Technician | null> {
    return this.technicianRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Technician>>
  ): Promise<Technician | null> {
    return this.technicianRepository.findById(id, options);
  }

  update(
    technician: Technician,
    values: InferAttributes<Technician>,
    options: UpdateOptions<Attributes<Technician>>
  ): Promise<Technician> {
    return this.technicianRepository.updateOne(technician, values, options);
  }
}
