import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Plan from './Plan';
import Category from './Category';
import PaymentPlanCategory from './PaymentPlanCategory';
import Joi from 'joi';

export const $paymentPlanSchema = {
  name: Joi.string().required().label('Payment Plans Name'),
  discount: Joi.string().allow('').label('Discount'),
  plan: Joi.string().required().label('Plans Name'),
  coverage: Joi.string().required().label('Coverage'),
  descriptions: Joi.array().allow().label('Payment Plans Description'),
  parameters: Joi.array().allow().label('Payment Plans Coverage'),
  pricing: Joi.array().allow().label('Payment Plans Pricing'),
};

@Table({
  tableName: 'payment_plans',
  timestamps: true,
})
export default class PaymentPlan extends Model<InferAttributes<PaymentPlan>, InferCreationAttributes<PaymentPlan>> {
  @Column({
    type: DataType.INTEGER,
    field: 'payment_plan_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.STRING)
  declare coverage: string;

  @Column(DataType.DOUBLE)
  declare value: number;

  @Column(DataType.BOOLEAN)
  declare hasPromo: boolean;

  @Column(DataType.DOUBLE)
  declare discount: number;

  @Column(DataType.ARRAY(DataType.STRING))
  declare descriptions: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  declare parameters: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  declare pricing: string[];

  @BelongsTo(() => Plan, { onDelete: 'cascade' })
  declare plan: NonAttribute<Plan>;

  @ForeignKey(() => Plan)
  @Column(DataType.INTEGER)
  declare planId: NonAttribute<number>;

  @BelongsToMany(() => Category, () => PaymentPlanCategory)
  declare categories: NonAttribute<Array<Category & { PaymentPlanCategory: PaymentPlanCategory }>>;
}
