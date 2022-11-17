import CrudRepository from "../helpers/CrudRepository";
import PaymentTerm from "../models/PaymentTerm";

export default class PaymentTermRepository extends CrudRepository<PaymentTerm, number> {
  constructor() {
    super(PaymentTerm);
  }
}
