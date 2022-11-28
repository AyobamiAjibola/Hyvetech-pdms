import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import BillingInformationRepository from '../../repositories/BillingInformationRepository';
import BillingInformation from '../../models/BillingInformation';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class BillingInformationDAOService implements ICrudDAO<BillingInformation> {
  private readonly billingInformationRepository: BillingInformationRepository;

  constructor(billingInformationRepository: BillingInformationRepository) {
    this.billingInformationRepository = billingInformationRepository;
  }

  create(
    values: CreationAttributes<BillingInformation>,
    options?: CreateOptions<Attributes<BillingInformation>>,
  ): Promise<BillingInformation> {
    return this.billingInformationRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<BillingInformation>): Promise<void> {
    return this.billingInformationRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<BillingInformation>>): Promise<BillingInformation[]> {
    return this.billingInformationRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<BillingInformation>>): Promise<BillingInformation | null> {
    return this.billingInformationRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<BillingInformation>>): Promise<BillingInformation | null> {
    return this.billingInformationRepository.findById(id, options);
  }

  update(
    appointment: BillingInformation,
    values: InferAttributes<BillingInformation>,
    options: UpdateOptions<Attributes<BillingInformation>>,
  ): Promise<BillingInformation> {
    return this.billingInformationRepository.updateOne(appointment, values, options);
  }
}
