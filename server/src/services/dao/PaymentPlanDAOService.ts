import {
  Attributes,
  BulkCreateOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import PaymentPlanRepository from "../../repositories/PaymentPlanRepository";
import PaymentPlan from "../../models/PaymentPlan";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class PaymentPlanDAOService implements ICrudDAO<PaymentPlan> {
  private readonly paymentPlanRepository: PaymentPlanRepository;

  constructor(paymentPlanRepository: PaymentPlanRepository) {
    this.paymentPlanRepository = paymentPlanRepository;
  }

  bulkCreate(
    records: ReadonlyArray<CreationAttributes<PaymentPlan>>,
    options?: BulkCreateOptions<Attributes<PaymentPlan>>
  ): Promise<PaymentPlan[]> {
    return this.paymentPlanRepository.bulkCreate(records, options);
  }

  create(
    values: CreationAttributes<PaymentPlan>,
    options?: CreateOptions<Attributes<PaymentPlan>>
  ): Promise<PaymentPlan> {
    return this.paymentPlanRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<PaymentPlan>): Promise<void> {
    return this.paymentPlanRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<PaymentPlan>>): Promise<PaymentPlan[]> {
    return this.paymentPlanRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<PaymentPlan>>): Promise<PaymentPlan | null> {
    return this.paymentPlanRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<PaymentPlan>>): Promise<PaymentPlan | null> {
    return this.paymentPlanRepository.findById(id, options);
  }

  update(
    appointment: PaymentPlan,
    values: InferAttributes<PaymentPlan>,
    options: UpdateOptions<Attributes<PaymentPlan>>
  ): Promise<PaymentPlan> {
    return this.paymentPlanRepository.updateOne(appointment, values, options);
  }
}
