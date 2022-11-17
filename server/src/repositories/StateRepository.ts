import CrudRepository from '../helpers/CrudRepository';
import State from '../models/State';

export default class StateRepository extends CrudRepository<State, number> {
  constructor() {
    super(State);
  }
}
