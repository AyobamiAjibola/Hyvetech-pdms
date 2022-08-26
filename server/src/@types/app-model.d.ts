import { Model } from "sequelize-typescript";
import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  SyncOptions,
  UpdateOptions,
} from "sequelize";
import { BulkCreateOptions } from "sequelize/types/model";

export declare namespace appModelTypes {
  type DomainClass<M> = new () => M;

  abstract class AbstractCrudRepository<
    M extends Model = Model,
    Id extends number = number
  > {
    /**
     * @name save
     * @param values
     * @param options
     * @desc
     * Save an instance of a model to the database.
     * This method calls sequelize create method.
     * Pass optional config, to control the query outcome
     */
    save(
      values: CreationAttributes<M>,
      options?: CreateOptions<Attributes<M>>
    ): Promise<M>;

    /**
     * @name exist
     * @param values
     * @param options
     * @desc
     * Checks if an instance of a model exist in the database.
     * This method calls sequelize find one method.
     * Pass optional config, to control the query outcome
     */
    exist(
      values: InferAttributes<M>,
      options?: FindOptions<Attributes<M>>
    ): Promise<boolean>;

    /**
     * @name findById
     * @param id
     * @param options
     * @desc
     * Find model instance by Id.
     * This method calls sequelize findByPk method.
     * Pass optional config, to control the query outcome
     */
    findById(id: Id, options?: FindOptions<Attributes<M>>): Promise<M | null>;

    /**
     *
     * @param options
     */
    findAll(options?: FindOptions<Attributes<M>>): Promise<M[]>;

    /**
     *
     * @param options
     */
    findOne(options: FindOptions<Attributes<M>>): Promise<M | null>;

    /**
     * @name deleteById
     * @param id
     * @param options
     * @desc
     * Delete model data by Id..
     * This method calls the destroy method in sequelize.
     * Pass optional config, to control the query outcome
     */
    deleteById(id: Id, options?: DestroyOptions<Attributes<M>>): Promise<void>;

    /**
     * @name deleteOne
     * @param t
     * @param options
     * @desc
     * Delete model data by Id..
     * This method calls the destroy method of the model instance in sequelize.
     * Pass optional config, to control the query outcome
     */
    deleteOne(t: M, options?: DestroyOptions<Attributes<M>>): Promise<void>;

    /**
     * @name deleteAll
     * @param options
     * @desc
     * Delete all model data.
     * This method calls the sync method in sequelize with option force set to true.
     * Pass optional config, to control the query outcome
     */
    deleteAll(options?: SyncOptions): Promise<void>;

    /**
     * @name updateOne
     * @param t
     * @param values
     * @param options
     * @desc
     * Update model by any of its attributes.
     * This method calls the update method in sequelize.
     * Pass optional config, to control the query outcome
     */
    updateOne(
      t: M,
      values: Attributes<M>,
      options?: UpdateOptions<Attributes<M>>
    ): Promise<M>;

    /**
     * @name bulkCreate
     * @param records
     * @param options
     * @desc
     * Create models passed as arrays, at once..
     * This method calls the bulkCreate method in sequelize.
     * Pass optional config, to control the query outcome
     */
    bulkCreate(
      records: ReadonlyArray<CreationAttributes<M>>,
      options?: BulkCreateOptions<Attributes<M>>
    ): Promise<M[]>;

    model?: string;
  }

  interface ICrudDAO<M extends Model = Model> {
    create(
      values: CreationAttributes<M>,
      options?: CreateOptions<M>
    ): Promise<M>;

    update(
      t: M,
      values: CreationAttributes<M>,
      options?: UpdateOptions<Attributes<M>>
    ): Promise<M>;

    findById(
      id: number,
      options?: FindOptions<Attributes<M>>
    ): Promise<M | null>;

    deleteById(
      id: number,
      options?: DestroyOptions<Attributes<M>>
    ): Promise<void>;

    findByAny(options: FindOptions<Attributes<M>>): Promise<M | null>;

    findAll(options?: FindOptions<Attributes<M>>): Promise<M[]>;
  }
}
