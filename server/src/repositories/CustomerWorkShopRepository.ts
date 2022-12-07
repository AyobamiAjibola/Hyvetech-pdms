import CrudRepository from '../helpers/CrudRepository';
import CustomerWorkShop from '../models/CustomerWorkShop';

export default class CustomerWorkShopRepository extends CrudRepository<CustomerWorkShop, number> {
  constructor() {
    super(CustomerWorkShop);
  }
}
