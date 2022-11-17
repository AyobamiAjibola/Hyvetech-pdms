import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import PaymentGatewayRepository from "../../repositories/PaymentGatewayRepository";
import PaymentGateway from "../../models/PaymentGateway";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PaymentGatewayDAOService implements ICrudDAO<PaymentGateway> {
  private paymentGateway: PaymentGatewayRepository;

  constructor(paymentGateway: PaymentGatewayRepository) {
    this.paymentGateway = paymentGateway;
  }

  create(
    values: CreationAttributes<PaymentGateway>,
    options?: CreateOptions<Attributes<PaymentGateway>>
  ): Promise<PaymentGateway> {
    return this.paymentGateway.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<PaymentGateway>): Promise<void> {
    return this.paymentGateway.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<PaymentGateway>>): Promise<PaymentGateway[]> {
    return this.paymentGateway.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<PaymentGateway>>): Promise<PaymentGateway | null> {
    return this.paymentGateway.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<PaymentGateway>>): Promise<PaymentGateway | null> {
    return this.paymentGateway.findById(id, options);
  }

  update(
    paymentGateway: PaymentGateway,
    values: InferAttributes<PaymentGateway>,
    options: UpdateOptions<Attributes<PaymentGateway>>
  ): Promise<PaymentGateway> {
    return this.paymentGateway.updateOne(paymentGateway, values, options);
  }
}
