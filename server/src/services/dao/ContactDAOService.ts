import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import ContactRepository from "../../repositories/ContactRepository";
import Contact from "../../models/Contact";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ContactDAOService implements ICrudDAO<Contact> {
  private contactRepository: ContactRepository;

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository;
  }

  create(
    values: CreationAttributes<Contact>,
    options?: CreateOptions<Attributes<Contact>>
  ): Promise<Contact> {
    return this.contactRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<Contact>): Promise<void> {
    return this.contactRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Contact>>): Promise<Contact[]> {
    return this.contactRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<Contact>>
  ): Promise<Contact | null> {
    return this.contactRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Contact>>
  ): Promise<Contact | null> {
    return this.contactRepository.findById(id, options);
  }

  update(
    contact: Contact,
    values: InferAttributes<Contact>,
    options: UpdateOptions<Attributes<Contact>>
  ): Promise<Contact> {
    return this.contactRepository.updateOne(contact, values, options);
  }
}
