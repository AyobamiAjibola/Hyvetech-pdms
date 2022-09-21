import RideShareDriverSubscriptionRepository from "../../repositories/RideShareDriverSubscriptionRepository";
import RideShareDriverSubscription from "../../models/RideShareDriverSubscription";
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

export default class RideShareDriverSubscriptionDAOService
  implements ICrudDAO<RideShareDriverSubscription>
{
  private rideShareDriverSubscription: RideShareDriverSubscriptionRepository;

  constructor(
    rideShareDriverSubscription: RideShareDriverSubscriptionRepository
  ) {
    this.rideShareDriverSubscription = rideShareDriverSubscription;
  }

  create(
    values: CreationAttributes<RideShareDriverSubscription>,
    options?: CreateOptions<Attributes<RideShareDriverSubscription>>
  ): Promise<RideShareDriverSubscription> {
    return this.rideShareDriverSubscription.save(values, options);
  }

  update(
    district: RideShareDriverSubscription,
    values: InferAttributes<RideShareDriverSubscription>,
    options: UpdateOptions<InferAttributes<RideShareDriverSubscription>>
  ): Promise<RideShareDriverSubscription> {
    return this.rideShareDriverSubscription.updateOne(
      district,
      values,
      options
    );
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<RideShareDriverSubscription>>
  ): Promise<RideShareDriverSubscription | null> {
    return this.rideShareDriverSubscription.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<RideShareDriverSubscription>>
  ): Promise<void> {
    return this.rideShareDriverSubscription.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<RideShareDriverSubscription>>
  ): Promise<RideShareDriverSubscription | null> {
    return this.rideShareDriverSubscription.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<RideShareDriverSubscription>>
  ): Promise<RideShareDriverSubscription[]> {
    return this.rideShareDriverSubscription.findAll(options);
  }
}
