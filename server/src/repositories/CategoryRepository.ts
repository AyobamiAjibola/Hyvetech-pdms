import CrudRepository from "../helpers/CrudRepository";
import Category from "../models/Category";

export default class CategoryRepository extends CrudRepository<
  Category,
  number
> {
  constructor() {
    super(Category);
  }
}
