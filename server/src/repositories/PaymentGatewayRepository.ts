import CrudRepository from "../helpers/CrudRepository";
import PaymentGateway from "../models/PaymentGateway";

export default class PaymentGatewayRepository extends CrudRepository<PaymentGateway, number> {
  constructor() {
    super(PaymentGateway);
  }
}
