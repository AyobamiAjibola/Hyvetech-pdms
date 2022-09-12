import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import PaymentTermRepository from "../../repositories/PaymentTermRepository";
import PaymentTerm from "../../models/PaymentTerm";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PaymentTermDAOService implements ICrudDAO<PaymentTerm> {
  private paymentTerm: PaymentTermRepository;

  constructor(paymentTerm: PaymentTermRepository) {
    this.paymentTerm = paymentTerm;
  }

  create(
    values: CreationAttributes<PaymentTerm>,
    options?: CreateOptions<Attributes<PaymentTerm>>
  ): Promise<PaymentTerm> {
    return this.paymentTerm.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<PaymentTerm>): Promise<void> {
    return this.paymentTerm.deleteById(id, options);
  }

  findAll(
    options?: FindOptions<Attributes<PaymentTerm>>
  ): Promise<PaymentTerm[]> {
    return this.paymentTerm.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<PaymentTerm>>
  ): Promise<PaymentTerm | null> {
    return this.paymentTerm.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<PaymentTerm>>
  ): Promise<PaymentTerm | null> {
    return this.paymentTerm.findById(id, options);
  }

  update(
    paymentTerm: PaymentTerm,
    values: InferAttributes<PaymentTerm>,
    options: UpdateOptions<Attributes<PaymentTerm>>
  ): Promise<PaymentTerm> {
    return this.paymentTerm.updateOne(paymentTerm, values, options);
  }
}
