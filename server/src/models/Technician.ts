import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Joi from "joi";

import Role from "./Role";
import Contact from "./Contact";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import Job from "./Job";
import TechnicianRole from "./TechnicianRole";
import PartnerTechnician from "./PartnerTechnician";
import Partner from "./Partner";

export const $technicianSchema = {
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.string().max(11).required().label("Phone Number"),
  state: Joi.string().required().label("State"),
  district: Joi.string().required().label("District"),
};

@Table({
  timestamps: true,
  tableName: "technicians",
})
export default class Technician extends Model<
  InferAttributes<Technician>,
  InferCreationAttributes<Technician>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "technician_id" })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare companyName: string;

  @Column(DataType.STRING)
  declare designation: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare rawPassword: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare gender: string;

  @Column(DataType.STRING)
  declare profileImageUrl: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare enabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare hasJob: boolean;

  @Column(DataType.STRING(3000))
  declare loginToken: string;

  @Column(DataType.STRING)
  declare gatewayId: string;

  @Column(DataType.DATE)
  declare loginDate: Date;

  @HasMany(() => Contact, { onDelete: "cascade" })
  declare contacts: NonAttribute<Contact[]>;

  @HasMany(() => Job, { onDelete: "cascade" })
  declare jobs: NonAttribute<Job[]>;

  @BelongsToMany(() => Role, () => TechnicianRole)
  declare roles: NonAttribute<Array<Role & { TechnicianRole: TechnicianRole }>>;

  @BelongsToMany(() => Partner, () => PartnerTechnician)
  declare partners: NonAttribute<
    Array<Partner & { PartnerTechnician: PartnerTechnician }>
  >;
}
