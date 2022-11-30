import CrudRepository from '../helpers/CrudRepository';
import Invoice from '../models/Invoice';

export default class InvoiceRepository extends CrudRepository<Invoice, number> {
  constructor() {
    super(Invoice);
  }
}
