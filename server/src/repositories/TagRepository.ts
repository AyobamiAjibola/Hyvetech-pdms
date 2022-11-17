import CrudRepository from '../helpers/CrudRepository';
import Tag from '../models/Tag';

export default class TagRepository extends CrudRepository<Tag, number> {
  constructor() {
    super(Tag);
  }
}
