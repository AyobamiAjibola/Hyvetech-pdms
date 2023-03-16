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
import Beneficiary from '../../models/Beneficiary';
import BeneficiaryRepository from '../../repositories/BeneficiaryRepository';

export default class BeneficiaryDAOService implements ICrudDAO<Beneficiary> {
  private beneficiaryRepository: BeneficiaryRepository;

  constructor(bankRepository: BeneficiaryRepository) {
    this.beneficiaryRepository = bankRepository;
  }

  create(
    values: CreationAttributes<Beneficiary>,
    options?: CreateOptions<Attributes<Beneficiary>>,
  ): Promise<Beneficiary> {
    return this.beneficiaryRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Beneficiary>): Promise<void> {
    return this.beneficiaryRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Beneficiary>>): Promise<Beneficiary[]> {
    return this.beneficiaryRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Beneficiary>>): Promise<Beneficiary | null> {
    return this.beneficiaryRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Beneficiary>>): Promise<Beneficiary | null> {
    return this.beneficiaryRepository.findById(id, options);
  }

  update(
    data: Beneficiary,
    values: InferAttributes<Beneficiary>,
    options: UpdateOptions<Attributes<Beneficiary>>,
  ): Promise<Beneficiary> {
    return this.beneficiaryRepository.updateOne(data, values, options);
  }
}
