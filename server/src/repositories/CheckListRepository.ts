import CrudRepository from '../helpers/CrudRepository';
import CheckList from '../models/CheckList';

export default class CheckListRepository extends CrudRepository<CheckList, number> {
  constructor() {
    super(CheckList);
  }
}
