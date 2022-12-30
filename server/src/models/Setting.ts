import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import Joi from 'joi';

export const $updateSetting: Joi.SchemaMap<Attributes<Setting>> = {
  name: Joi.string().required().label('Settings Name'),
  type: Joi.any().allow().label('Settings Type'),
  value: Joi.string().required().label('Settings Value'),
};

@Table({
  timestamps: true,
  tableName: 'settings',
})
export default class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.STRING)
  declare value: string;
}
