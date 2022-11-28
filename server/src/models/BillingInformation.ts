import { AutoIncrement, BelongsToMany, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { InferAttributes } from 'sequelize/types';
import { CreationOptional, InferCreationAttributes, NonAttribute } from 'sequelize';
import Estimate from './Estimate';
import Joi from 'joi';
import EstimateBillingInformation from './EstimateBillingInformation';

export interface IBillingInfoSchema {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  district: string;
  address: string;
}

export const $addBillingInfoSchema: Joi.SchemaMap<IBillingInfoSchema> = {
  id: Joi.number().allow().label('Id'),
  title: Joi.string().required().label('Title'),
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  phone: Joi.string().required().label('Phone'),
  state: Joi.string().required().label('State'),
  district: Joi.string().required().label('District'),
  address: Joi.string().required().label('Street & House Number'),
};

@Table({ tableName: 'billing_information', timestamps: true })
export default class BillingInformation extends Model<
  InferAttributes<BillingInformation>,
  InferCreationAttributes<BillingInformation>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'billing_info_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare state: string;

  @Column(DataType.STRING)
  declare district: string;

  @Column(DataType.STRING)
  declare address: string;

  @BelongsToMany(() => Estimate, () => EstimateBillingInformation)
  declare estimates: NonAttribute<Array<Estimate & { EstimateBillingInformation: EstimateBillingInformation }>>;
}
