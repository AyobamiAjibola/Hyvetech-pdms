import CrudRepository from '../helpers/CrudRepository';
import ItemStock from '../models/ItemStock';

export default class ItemStockRepository extends CrudRepository<ItemStock, number> {
    constructor() {
      super(ItemStock);
    }
}