import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Joi from "joi";

import Role from "./Role";
import UserRole from "./UserRole";
import Contact from "./Contact";

import { PASSWORD_PATTERN } from "../config/constants";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Partner from "./Partner";

export const $userSchema = {
  companyName: Joi.string().required().label("Company Name"),
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  username: Joi.string().required().label("Username"),
  role: Joi.string().required().label("User Role"),
  phone: Joi.string().max(11).allow("").label("Phone Number"),
};

export const $loginSchema = {
  username: Joi.string().required().label("Username"),
  password: Joi.string()
    .pattern(new RegExp(PASSWORD_PATTERN))
    .required()
    .label("Password"),
};

@Table({
  timestamps: true,
  tableName: "users",
})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "user_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare uniqueId: string | null;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare companyName: string | null;

  @Column(DataType.STRING)
  declare designation: string | null;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare gender: string | null;

  @Column(DataType.STRING)
  declare profileImageUrl: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare active: boolean | null;

  @Column(DataType.STRING(3000))
  declare loginToken: string | null;

  @Column(DataType.DATE)
  declare loginDate: Date | null;

  @HasMany(() => Contact)
  declare contacts: NonAttribute<Contact[]>;

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: NonAttribute<Array<Role & { UserRole: UserRole }>>;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: NonAttribute<number>;
}
