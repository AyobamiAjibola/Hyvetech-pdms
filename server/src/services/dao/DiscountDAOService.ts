import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import DiscountRepository from "../../repositories/DiscountRepository";
import Discount from "../../models/Discount";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class DiscountDAOService implements ICrudDAO<Discount> {
  private discountRepository: DiscountRepository;

  constructor(discountRepository: DiscountRepository) {
    this.discountRepository = discountRepository;
  }

  create(
    values: CreationAttributes<Discount>,
    options?: CreateOptions<Discount>
  ): Promise<Discount> {
    return this.discountRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Discount>): Promise<void> {
    return this.discountRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Discount>>): Promise<Discount[]> {
    return this.discountRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<Discount>>
  ): Promise<Discount | null> {
    return this.discountRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Discount>>
  ): Promise<Discount | null> {
    return this.discountRepository.findById(id, options);
  }

  update(
    discount: Discount,
    values: InferAttributes<Discount>,
    options: UpdateOptions<Attributes<Discount>>
  ): Promise<Discount> {
    return this.discountRepository.updateOne(discount, values, options);
  }
}
