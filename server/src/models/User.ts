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
  Attributes,
} from "sequelize";
import Partner from "./Partner";
import UserToken from "./UserToken";

export const $userSchema = {
  companyName: Joi.string().required().label("Company Name"),
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  role: Joi.string().required().label("User Role"),
  phone: Joi.string().max(11).allow("").label("Phone Number"),
};

export const $loginSchema = {
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().label("Password"),
};

export const $passwordResetSchema = {
  email: Joi.string().required().label("email"),
};

export const $resetPasswordWithTokenSchema = {
  token: Joi.string().required().label("token"),
  password: Joi.string().required().label("password"),
};

export type UserSchemaType = Attributes<User> & { roleId: number };

export const $saveUserSchema: Joi.SchemaMap<UserSchemaType> = {
  firstName: Joi.string().required().label("firstName"),
  lastName: Joi.string().required().label("lastName"),
  email: Joi.string().required().label("email"),
  accountType: Joi.string().required().label("accountType"),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      "string.pattern.base": `Password does not meet requirement.`,
    })
    .required()
    .label("password"),
  rawPassword: Joi.string().optional().label("rawPassword"),
  phone: Joi.string().required().label("phone"),
  address: Joi.string().required().label("address"),
  roleId: Joi.number().required().label("roleId"),
};

export const $updateUserSchema: Joi.SchemaMap<any> = {
  id: Joi.number().required().label("id"),
  firstName: Joi.string().label("firstName"),
  lastName: Joi.string().label("lastName"),
  email: Joi.string().label("email"),
  phone: Joi.string().label("phone"),
  // password: Joi.string()
  //   .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
  //   .messages({
  //     "string.pattern.base": `Password does not meet requirement.`,
  //   })
  //   .optional()
  //   .label("password"),
    address: Joi.string().label("address"),
    state: Joi.string().label("state"),
    district: Joi.string().label("district"),
    partnerId: Joi.string().label("partnerId")
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
  declare resetCode: string;

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
  declare rawPassword: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare gender: string | null;

  @Column(DataType.STRING)
  declare address: string;

  @Column(DataType.STRING)
  declare accountType: string;

  @Column(DataType.STRING)
  declare profileImageUrl: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare active: boolean | null;

  @Column(DataType.TEXT)
  declare loginToken: string | null;

  @Column(DataType.DATE)
  declare loginDate: Date | null;

  @HasMany(() => Contact, { onDelete: "SET NULL" })
  declare contacts: NonAttribute<Contact[]>;

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: NonAttribute<Array<Role & { UserRole: UserRole }>>;

  @BelongsTo(() => Partner)
  declare partner: NonAttribute<Partner>;

  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: NonAttribute<number>;

  // @HasOne(() => UserToken)
  // declare userToken: NonAttribute<UserToken>;
}
