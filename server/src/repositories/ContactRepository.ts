import CrudRepository from "../helpers/CrudRepository";
import Contact from "../models/Contact";

export default class ContactRepository extends CrudRepository<Contact, number> {
  constructor() {
    super(Contact);
  }
}
