import { Model, Repository, Sequelize } from "sequelize-typescript";
import {
  Attributes,
  BulkCreateOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  SyncOptions,
  UpdateOptions,
} from "sequelize";

import { appModelTypes } from "../@types/app-model";
import database from "../config/database";
import DomainClass = appModelTypes.DomainClass;
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;

export default class CrudRepository<M extends Model, Id extends number>
  implements AbstractCrudRepository<M, Id>
{
  private repository: Repository<M>;
  protected sequelize: Sequelize;
  private declare readonly _model: string;

  constructor(modelClass: DomainClass<M>) {
    this._model = modelClass.name;
    this.sequelize = database.sequelize;
    this.repository = this.sequelize.getRepository(modelClass);
  }

  bulkCreate(
    records: ReadonlyArray<CreationAttributes<M>>,
    options?: BulkCreateOptions<Attributes<M>>
  ): Promise<M[]> {
    return this.sequelize.transaction(async () => {
      return this.repository.bulkCreate(records, options);
    });
  }

  deleteAll(options?: SyncOptions): Promise<void> {
    return this.sequelize.transaction(async () => {
      await this.repository.sync(options);
    });
  }

  deleteById(id: Id, options?: DestroyOptions<Attributes<M>>): Promise<void> {
    return this.sequelize.transaction(async () => {
      const model = await this.repository.findByPk(id);
      await model?.destroy(options);
    });
  }

  deleteOne(t: M, options?: DestroyOptions<Attributes<M>>): Promise<void> {
    return this.sequelize.transaction(async () => {
      await t.destroy(options);
    });
  }

  exist(values: M, options?: FindOptions<Attributes<M>>): Promise<boolean> {
    return this.sequelize.transaction(async () => {
      const models = await this.repository.findAll(options);
      return models.includes(values);
    });
  }

  findAll(options?: FindOptions<Attributes<M>>): Promise<M[]> {
    return this.sequelize.transaction(async () => {
      return this.repository.findAll(options);
    });
  }

  findById(id: Id, options?: FindOptions<Attributes<M>>): Promise<M | null> {
    return this.sequelize.transaction(async () => {
      return this.repository.findByPk(id, options);
    });
  }

  findOne(options: FindOptions<Attributes<M>>): Promise<M | null> {
    return this.sequelize.transaction(async () => {
      return this.repository.findOne({ ...options });
    });
  }

  save(values: CreationAttributes<M>, options?: CreateOptions): Promise<M> {
    return this.sequelize.transaction(async () => {
      return this.repository.create(values, options);
    });
  }

  updateOne(
    t: M,
    values: CreationAttributes<M>,
    options?: UpdateOptions<Attributes<M>>
  ): Promise<M> {
    return this.sequelize.transaction(async () => {
      return t.update(values, options);
    });
  }

  deleteByAny(filter: DestroyOptions<Attributes<M>>): Promise<void> {
    return this.sequelize.transaction(async () => {
      await this.repository.destroy(filter);
    });
  }

  updateByAny(
    update: Attributes<M>,
    options: UpdateOptions<Attributes<M>> | undefined
  ): Promise<M | null> {
    return this.sequelize.transaction(async () => {
      const model = await this.repository.findOne(options);
      await model?.update(update);
      return model;
    });
  }

  get model(): string {
    return this._model;
  }
}
