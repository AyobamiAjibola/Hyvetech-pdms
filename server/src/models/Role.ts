import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import Permission from './Permission';
import RolePermission from './RolePermission';
import Joi from 'joi';
import Customer from './Customer';
import CustomerRole from './CustomerRole';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import UserRole from './UserRole';
import User from './User';
import RideShareDriverRole from './RideShareDriverRole';
import RideShareDriver from './RideShareDriver';
import Partner from './Partner';

export const $roleSchema = {
  name: Joi.string().required().label('Role Name'),
};

export type RoleSchemaType = Attributes<Role> & { permissions: string[] };

export const $saveRoleSchema: Joi.SchemaMap<RoleSchemaType> = {
  name: Joi.string().required().label('name'),
  permissions: Joi.array().required().label('permissions'),
};

export const $updateRoleSchema: Joi.SchemaMap<RoleSchemaType> = {
  permissions: Joi.array().required().label('permissions'),
  id: Joi.number().required().label('roleId'),
};

@Table({
  timestamps: true,

  tableName: 'roles',
})
export default class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'role_id', allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;
  @Column(DataType.STRING)
  declare slug: string;

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions: NonAttribute<Array<Permission & { RolePermission: RolePermission }>>;

  @BelongsToMany(() => Customer, () => CustomerRole)
  declare customers: NonAttribute<Array<Customer & { CustomerRole: CustomerRole }>>;

  // @BelongsToMany(() => User, () => UserRole)
  // declare users: NonAttribute<Array<User & { UserRole: UserRole }>>;

  @BelongsToMany(() => RideShareDriver, () => RideShareDriverRole)
  declare rideShareDrivers: NonAttribute<Array<RideShareDriver & { RideShareDriverRole: RideShareDriverRole }>>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: CreationOptional<number>;

  @HasMany(() => User)
  declare users: NonAttribute<Array<User>>;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: NonAttribute<number>;
}
