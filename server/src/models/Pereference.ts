import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Joi from 'joi';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

import Partner from './Partner';

export type PreferenceSchemaType = Attributes<Preference> & { permissions: string[] };

export const $savePreferenceSchema: Joi.SchemaMap<PreferenceSchemaType> = {
  termsAndCondition: Joi.string().required().label('terms'),
};

export const $updatePreferenceSchema: Joi.SchemaMap<PreferenceSchemaType> = {
  termsAndCondition: Joi.array().required().label('terms'),
};

@Table({
  timestamps: true,

  tableName: 'preferences',
})
export default class Preference extends Model<InferAttributes<Preference>, InferCreationAttributes<Preference>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'preference_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.TEXT)
  declare termsAndCondition: string;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: CreationOptional<number>;
}
