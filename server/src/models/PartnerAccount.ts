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

export type PartnerAccountSchemaType = Attributes<PartnerAccount>;

export type CBAAccountUpdateType = {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  password: string;
};

export type PerformNameEnquirySchemaType = {
  beneficiaryBankCode: string;
  beneficiaryAccountNumber: string;
};

export const $savePartnerAccountSchema: Joi.SchemaMap<PartnerAccountSchemaType> = {
  businessName: Joi.string().required().label('businessName'),
  pin: Joi.string().required().label('pin'),
  nin: Joi.string().required().label('nin'),
};

export const performNameEnquirySchema: Joi.SchemaMap<PerformNameEnquirySchemaType> = {
  beneficiaryBankCode: Joi.string().required().label('beneficiaryBankCode'),
  beneficiaryAccountNumber: Joi.string().required().label('beneficiaryAccountNumber'),
};

export const $updatePartnerAccountSchema: Joi.SchemaMap<PartnerAccountSchemaType & { currentPin: string }> = {
  businessName: Joi.string().optional().label('businessName'),
  pin: Joi.string().optional().label('pin'),
  currentPin: Joi.string().optional().label('currentPin'),
};

export const $resetPartnerAccountPinSchema: Joi.SchemaMap<PartnerAccountSchemaType & { resetCode: string }> = {
  businessName: Joi.string().optional().label('businessName'),
  pin: Joi.string().optional().label('pin'),
  resetCode: Joi.string().optional().label('resetCode'),
};

export const $updateCBAAccountDetail: Joi.SchemaMap<CBAAccountUpdateType> = {
  businessName: Joi.string().optional().label('businessName'),
  firstName: Joi.string().optional().label('firstName'),
  lastName: Joi.string().optional().label('lastName'),
  email: Joi.string().optional().label('email'),
  password: Joi.string().optional().label('password')
};

@Table({
  timestamps: true,
  tableName: 'partner_account',
})
export default class PartnerAccount extends Model<
  InferAttributes<PartnerAccount>,
  InferCreationAttributes<PartnerAccount>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'partner_account_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare accountRef: CreationOptional<string>;

  @Column(DataType.STRING)
  declare accountNumber: CreationOptional<string>;

  @Column(DataType.STRING)
  declare email: string;

  @Column({ type: DataType.STRING, defaultValue: 'KUDA-MFB' })
  declare accountProvider: CreationOptional<string>;

  @Column({ type: DataType.STRING, defaultValue: true })
  declare isActive: CreationOptional<boolean>;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare middleName: CreationOptional<string>;

  @Column(DataType.STRING)
  declare nin: string;

  @Column(DataType.STRING)
  declare phoneNumber: string;

  @Column(DataType.STRING)
  declare businessName: string;

  @Column(DataType.STRING)
  declare pin: string;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: CreationOptional<number>;
}
