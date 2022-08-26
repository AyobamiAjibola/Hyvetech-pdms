import CrudRepository from "../helpers/CrudRepository";
import Customer from "../models/Customer";

export default class CustomerRepository extends CrudRepository<
  Customer,
  number
> {
  constructor() {
    super(Customer);
  }
}
