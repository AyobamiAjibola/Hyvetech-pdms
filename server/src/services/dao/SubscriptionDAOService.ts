import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import SubscriptionRepository from '../../repositories/SubscriptionRepository';
import Subscription from '../../models/Subscription';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class SubscriptionDAOService implements ICrudDAO<Subscription> {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  create(
    values: CreationAttributes<Subscription>,
    options?: CreateOptions<Attributes<Subscription>>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Subscription>): Promise<void> {
    return this.subscriptionRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Subscription>>): Promise<Subscription[]> {
    return this.subscriptionRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Subscription>>): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Subscription>>): Promise<Subscription | null> {
    return this.subscriptionRepository.findById(id, options);
  }

  update(
    subscription: Subscription,
    values: InferAttributes<Subscription>,
    options: UpdateOptions<Attributes<Subscription>>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.updateOne(subscription, values, options);
  }
}
