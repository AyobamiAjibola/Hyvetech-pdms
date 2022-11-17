import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Subscription from './Subscription';
import PaymentPlan from './PaymentPlan';
import Category from './Category';
import PlanCategory from './PlanCategory';
import Joi from 'joi';
import Partner from './Partner';
import { v4 } from 'uuid';

export const $planSchema = {
  label: Joi.string().required().label('Plans Name'),
  minVehicles: Joi.number().required().label('Minimum Vehicle'),
  maxVehicles: Joi.number().required().label('Maximum Vehicle'),
  validity: Joi.string().required().label('Plans Validity'),
  mobile: Joi.number().required().label('No of Mobile Service'),
  driveIn: Joi.number().required().label('No of Drive-in Service'),
  inspections: Joi.number().required().label('Total Inspections'),
  programme: Joi.string().required().label('Programme'),
  serviceMode: Joi.string().required().label('Service Mode'),
};

@Table({
  tableName: 'plans',
  timestamps: true,
})
export default class Plan extends Model<InferAttributes<Plan>, InferCreationAttributes<Plan>> {
  @Column({
    type: DataType.INTEGER,
    field: 'plan_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({ defaultValue: v4() })
  declare code: string;

  @Column(DataType.STRING)
  declare label: string;

  @Column(DataType.SMALLINT)
  declare minVehicles: number;

  @Column(DataType.SMALLINT)
  declare maxVehicles: number;

  @Column(DataType.INTEGER)
  declare inspections: number;

  @Column(DataType.INTEGER)
  declare mobile: number;

  @Column(DataType.INTEGER)
  declare driveIn: number;

  @Column(DataType.STRING)
  declare validity: string;

  @Column(DataType.STRING)
  declare serviceMode: string;

  @BelongsTo(() => Subscription, { onDelete: 'cascade' })
  declare subscriptions: Subscription;

  @ForeignKey(() => Subscription)
  @Column(DataType.INTEGER)
  declare subscriptionId: number;

  @BelongsTo(() => Partner, { onDelete: 'cascade' })
  declare partner: Partner;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

  @HasMany(() => PaymentPlan, { onDelete: 'cascade' })
  declare paymentPlans: PaymentPlan[];

  @BelongsToMany(() => Category, () => PlanCategory)
  declare categories: NonAttribute<Array<Category & { PlanCategory: PlanCategory }>>;
}
