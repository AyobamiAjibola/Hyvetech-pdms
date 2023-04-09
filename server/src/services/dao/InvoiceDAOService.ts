import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from 'sequelize';

import InvoiceRepository from '../../repositories/InvoiceRepository';
import Invoice from '../../models/Invoice';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;
import Generic from '../../utils/Generic';

export default class InvoiceDAOService implements ICrudDAO<Invoice> {
  private readonly invoiceRepository: InvoiceRepository;

  constructor(invoiceRepository: InvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  create(values: CreationAttributes<Invoice>, options?: CreateOptions<Attributes<Invoice>>): Promise<Invoice> {
    return this.invoiceRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Invoice>): Promise<void> {
    return this.invoiceRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Invoice>>): Promise<Invoice[]> {
    return this.invoiceRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Invoice>>): Promise<Invoice | null> {
    return this.invoiceRepository.findOne(options);
  }

  findById(id: number, options?: FindOptions<Attributes<Invoice>>): Promise<Invoice | null> {
    return this.invoiceRepository.findById(id, options);
  }

  update(
    appointment: Invoice,
    values: InferAttributes<Invoice>,
    options: UpdateOptions<Attributes<Invoice>>,
  ): Promise<Invoice> {
    return this.invoiceRepository.updateOne(appointment, values, options);
  }

  public async getTotalMonthlyInvoice() {
    return Generic.getMonthlyDataTotal(this.invoiceRepository);
  }
}
