import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";

import Plan from "./Plan";
import ServiceSubscription from "./ServiceSubscription";
import Service from "./Service";
import Joi from "joi";

export const $subscriptionSchema = {
  name: Joi.string().required().label("Name"),
  planCategory: Joi.string().required().label("Plans Category"),
  paymentPlan: Joi.string().required().label("Payment Plans"),
  price: Joi.string().required().label("Subscription Price"),
};

@Table({
  tableName: "subscriptions",
  timestamps: true,
})
export default class Subscription extends Model<
  InferAttributes<Subscription>,
  InferCreationAttributes<Subscription>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: "subscription_id",
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare slug: string;

  @BelongsToMany(() => Service, () => ServiceSubscription)
  declare services: NonAttribute<
    Array<Service & { ServiceSubscription: ServiceSubscription }>
  >;

  @HasMany(() => Plan)
  declare plans: NonAttribute<Plan[]>;
}
