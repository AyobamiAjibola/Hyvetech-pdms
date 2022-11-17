import CrudRepository from '../helpers/CrudRepository';
import PaymentDetail from '../models/PaymentDetail';

export default class PaymentDetailRepository extends CrudRepository<PaymentDetail, number> {
  constructor() {
    super(PaymentDetail);
  }
}
