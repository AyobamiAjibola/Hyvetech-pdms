import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes } from 'sequelize/types';
import { InferCreationAttributes, NonAttribute } from 'sequelize';
import Partner from './Partner';
import Joi from 'joi';

export type AccountActivationRequestSchemaType = Attributes<AccountActivationRequest>;

export const $saveAccountActivationRequestSchema: Joi.SchemaMap<AccountActivationRequestSchemaType> = {
  businessName: Joi.string().required().label('businessName'),
  cacUrl: Joi.string().optional().allow(null, '').label('cacUrl'),
  validIdBackUrl: Joi.string().optional().label('validIdBackUrl'),
  validIdFrontUrl: Joi.string().optional().label('validIdFrontUrl'),
  pin: Joi.string().optional().label('pin'),
  nin: Joi.string().required().label('nin'),
};

export const $updateAccountActivationRequestSchema: Joi.SchemaMap<AccountActivationRequestSchemaType> = {
  businessName: Joi.string().required().label('businessName'),
  cacUrl: Joi.string().optional().label('cacUrl'),
  validIdBackUrl: Joi.string().optional().label('validIdBackUrl'),
  validIdFrontUrl: Joi.string().optional().label('validIdFrontUrl'),
  pin: Joi.string().optional().label('pin'),
};

@Table({
  timestamps: true,
  tableName: 'account_activation_request',
})
export default class AccountActivationRequest extends Model<
  InferAttributes<AccountActivationRequest>,
  InferCreationAttributes<AccountActivationRequest>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'account_activation_request_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare businessName: CreationOptional<string>;

  @Column(DataType.STRING)
  declare cacUrl: CreationOptional<string>;

  @Column(DataType.STRING)
  declare validIdFrontUrl: string;

  @Column(DataType.STRING)
  declare pin: string;

  @Column(DataType.STRING)
  declare validIdBackUrl: string;

  @Column(DataType.STRING)
  declare nin: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isApproved: CreationOptional<boolean>;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: CreationOptional<number>;
}
