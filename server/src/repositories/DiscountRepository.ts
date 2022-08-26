import CrudRepository from "../helpers/CrudRepository";
import Discount from "../models/Discount";

export default class DiscountRepository extends CrudRepository<
  Discount,
  number
> {
  constructor() {
    super(Discount);
  }
}
