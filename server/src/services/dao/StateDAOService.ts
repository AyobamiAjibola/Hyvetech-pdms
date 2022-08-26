import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";

import StateRepository from "../../repositories/StateRepository";
import State from "../../models/State";
import { appModelTypes } from "../../@types/app-model";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class StateDAOService implements ICrudDAO<State> {
  private stateRepository: StateRepository;

  constructor(stateRepository: StateRepository) {
    this.stateRepository = stateRepository;
  }

  create(
    values: CreationAttributes<State>,
    options?: CreateOptions<State>
  ): Promise<State> {
    return this.stateRepository.save(values, options);
  }

  deleteById(id: number, options?: DestroyOptions<State>): Promise<void> {
    return this.stateRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<State>>): Promise<State[]> {
    return this.stateRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<State>>): Promise<State | null> {
    return this.stateRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<State>>
  ): Promise<State | null> {
    return this.stateRepository.findById(id, options);
  }

  update(
    state: State,
    values: InferAttributes<State>,
    options: UpdateOptions<Attributes<State>>
  ): Promise<State> {
    return this.stateRepository.updateOne(state, values, options);
  }
}
