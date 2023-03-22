import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

import Joi from 'joi';
import Expense from './Expense';
import Partner from './Partner';

export type beneficiarySchemaType = Attributes<Beneficiary>;

export const beneficiaryFields = {
  name: {
    name: 'name',
    label: 'name',
    error: {
      invalid: 'Name is required',
      required: 'Name is required',
    },
  },
  accountName: {
    name: 'Accoount Name',
    label: 'accountName',
    error: {
      invalid: 'Account name is required',
      required: 'Account name is required',
    },
  },
  accountNumber: {
    name: 'Account Number',
    label: 'accountNumber',
    error: {
      invalid: 'Acount number is required',
      required: 'Acount number is required',
    },
  },
  bankName: {
    name: 'Bank name',
    label: 'bankName',
    error: {
      invalid: 'Bank name is required',
      required: 'Bank name is required',
    },
  },
};

export const $saveBeneficiarySchema: Joi.SchemaMap<beneficiarySchemaType> = {
  name: Joi.string().required().label(beneficiaryFields.name.label),
  accountName: Joi.string().allow('').label(beneficiaryFields.accountName.label),
  bankName: Joi.string().allow('').optional().label(beneficiaryFields.bankName.label),
  accountNumber: Joi.string().allow('').optional().label(beneficiaryFields.accountNumber.label),
};

@Table({
  tableName: 'beneficiaries',
  timestamps: true,
})
export default class Beneficiary extends Model<InferAttributes<Beneficiary>, InferCreationAttributes<Beneficiary>> {
  @Column({
    type: DataType.INTEGER,
    field: 'beneficiary_id',
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
  @Column(DataType.STRING)
  declare accountNumber: string;
  @Column(DataType.STRING)
  declare bankName: string;
  @Column(DataType.STRING)
  declare accountName: string;

  @HasMany(() => Expense)
  declare expenses: NonAttribute<Expense[]>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;
}
