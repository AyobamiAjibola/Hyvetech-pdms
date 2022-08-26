import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import CustomerSubscriptionRepository from "../../repositories/CustomerSubscriptionRepository";
import CustomerSubscription from "../../models/CustomerSubscription";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class CustomerSubscriptionDAOService
  implements ICrudDAO<CustomerSubscription>
{
  private customerSubscriptionRepository: CustomerSubscriptionRepository;

  constructor(customerSubscriptionRepository: CustomerSubscriptionRepository) {
    this.customerSubscriptionRepository = customerSubscriptionRepository;
  }

  create(
    values: CreationAttributes<CustomerSubscription>,
    options?: CreateOptions<CustomerSubscription>
  ): Promise<CustomerSubscription> {
    return this.customerSubscriptionRepository.save(values, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<CustomerSubscription>
  ): Promise<void> {
    return this.customerSubscriptionRepository.deleteById(id, options);
  }

  findAll(
    options?: FindOptions<Attributes<CustomerSubscription>>
  ): Promise<CustomerSubscription[]> {
    return this.customerSubscriptionRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<CustomerSubscription>>
  ): Promise<CustomerSubscription | null> {
    return this.customerSubscriptionRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<CustomerSubscription>>
  ): Promise<CustomerSubscription | null> {
    return this.customerSubscriptionRepository.findById(id, options);
  }

  update(
    customerSubscription: CustomerSubscription,
    values: InferAttributes<CustomerSubscription>,
    options: UpdateOptions<Attributes<CustomerSubscription>>
  ): Promise<CustomerSubscription> {
    return this.customerSubscriptionRepository.updateOne(
      customerSubscription,
      values,
      options
    );
  }
}
