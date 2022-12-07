import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import CustomerWorkShopRepository from '../../repositories/CustomerWorkShopRepository';
import CustomerWorkShop from '../../models/CustomerWorkShop';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class CustomerWorkShopDAOService implements ICrudDAO<CustomerWorkShop> {
  private readonly customerWorkShopRepository: CustomerWorkShopRepository;

  constructor(customerWorkShopRepository: CustomerWorkShopRepository) {
    this.customerWorkShopRepository = customerWorkShopRepository;
  }

  create(
    values: CreationAttributes<CustomerWorkShop>,
    options?: CreateOptions<Attributes<CustomerWorkShop>>,
  ): Promise<CustomerWorkShop> {
    return this.customerWorkShopRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<CustomerWorkShop>): Promise<void> {
    return this.customerWorkShopRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<CustomerWorkShop>>): Promise<CustomerWorkShop[]> {
    return this.customerWorkShopRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<CustomerWorkShop>>): Promise<CustomerWorkShop | null> {
    return this.customerWorkShopRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<CustomerWorkShop>>): Promise<CustomerWorkShop | null> {
    return this.customerWorkShopRepository.findById(id, options);
  }

  update(
    appointment: CustomerWorkShop,
    values: InferAttributes<CustomerWorkShop>,
    options: UpdateOptions<Attributes<CustomerWorkShop>>,
  ): Promise<CustomerWorkShop> {
    return this.customerWorkShopRepository.updateOne(appointment, values, options);
  }
}
