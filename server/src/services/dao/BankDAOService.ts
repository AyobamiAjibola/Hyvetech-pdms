import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import BankRepository from "../../repositories/BankRepository";
import Bank from "../../models/Bank";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class BankDAOService implements ICrudDAO<Bank> {
  private bankRepository: BankRepository;

  constructor(bankRepository: BankRepository) {
    this.bankRepository = bankRepository;
  }

  create(
    values: CreationAttributes<Bank>,
    options?: CreateOptions<Attributes<Bank>>
  ): Promise<Bank> {
    return this.bankRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Bank>): Promise<void> {
    return this.bankRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Bank>>): Promise<Bank[]> {
    return this.bankRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Bank>>): Promise<Bank | null> {
    return this.bankRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Bank>>
  ): Promise<Bank | null> {
    return this.bankRepository.findById(id, options);
  }

  update(
    bank: Bank,
    values: InferAttributes<Bank>,
    options: UpdateOptions<Attributes<Bank>>
  ): Promise<Bank> {
    return this.bankRepository.updateOne(bank, values, options);
  }
}
