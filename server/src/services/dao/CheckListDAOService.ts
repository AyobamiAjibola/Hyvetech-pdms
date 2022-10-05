import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import CheckListRepository from "../../repositories/CheckListRepository";
import CheckList from "../../models/CheckList";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class CheckListDAOService implements ICrudDAO<CheckList> {
  private readonly checklistRepository: CheckListRepository;

  constructor(checklistRepository: CheckListRepository) {
    this.checklistRepository = checklistRepository;
  }

  create(
    values: CreationAttributes<CheckList>,
    options?: CreateOptions<Attributes<CheckList>>
  ): Promise<CheckList> {
    return this.checklistRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<CheckList>): Promise<void> {
    return this.checklistRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<CheckList>>): Promise<CheckList[]> {
    return this.checklistRepository.findAll(options);
  }

  findByAny(
    options: FindOptions<Attributes<CheckList>>
  ): Promise<CheckList | null> {
    return this.checklistRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<CheckList>>
  ): Promise<CheckList | null> {
    return this.checklistRepository.findById(id, options);
  }

  update(
    checklist: CheckList,
    values: InferAttributes<CheckList>,
    options: UpdateOptions<Attributes<CheckList>>
  ): Promise<CheckList> {
    return this.checklistRepository.updateOne(checklist, values, options);
  }
}
