import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Attributes, CreationOptional, InferAttributes } from "sequelize/types";
import Contact from "./Contact";
import { InferCreationAttributes, NonAttribute } from "sequelize";
import User from "./User";
import PartnerCategory from "./PartnerCategory";
import Category from "./Category";
import Plan from "./Plan";
import PartnerRideShareDriver from "./PartnerRideShareDriver";
import RideShareDriver from "./RideShareDriver";
import Job from "./Job";
import Technician from "./Technician";
import PartnerTechnician from "./PartnerTechnician";
import CheckList from "./CheckList";
import PartnerCheckList from "./PartnerCheckList";
import Estimate from "./Estimate";
import Transaction from "./Transaction";
import Expense from "./Expense";
import Beneficiary from "./Beneficiary";
import ExpenseType from "./ExpenseType";
import Role from "./Role";
import Preference from "./Pereference";
import ItemStock from "./ItemStock";
import ReminderType from "./ReminderType";
import ServiceReminder from "./ServiceReminder";
import PartnerAccount from "./PartnerAccount";
import Joi from "joi";

export type CreatePartnerType = Attributes<Partner>;
export type UpdatePartnerProfile = {
  firstName?: string;
  lastName?: string;
  password?: string;
  state?: string;
  district?: string;
  address?: string;
  phone?: string;
};

export const $createPartnerKyc: Joi.SchemaMap<any> = {
  phone: Joi.string().allow("").label("Phone"),
  cac: Joi.string().allow("").label("CAC"),
  name: Joi.string().label("Company Full Name"),
  nameOfDirector: Joi.string().allow("").label("Name of Director"),
  nameOfManager: Joi.string().allow("").label("Name of Manager"),
  vatNumber: Joi.string().allow("").label("VAT Number"),
  workshopAddress: Joi.string().allow("").label("Workshop Address"),
  tin: Joi.string().allow("").label("TIN"),
  state: Joi.string().allow("").label("state"),
  district: Joi.string().allow("").label("district"),
  businessCategory: Joi.string().allow("").label("Business Category"),
  businessRegStatus: Joi.string().allow("").label("Business Status"),
};

export const $updatePartnerProfile: Joi.SchemaMap<UpdatePartnerProfile> = {
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  password: Joi.string().optional(),
  state: Joi.string().optional(),
  district: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().optional(),
};

export const $createPartnerSettings: Joi.SchemaMap<CreatePartnerType> = {
  accountName: Joi.string().allow("").label("Account Name"),
  accountNumber: Joi.string().allow("").label("Account Number"),
  bankName: Joi.string().allow("").label("Bank Name"),
  googleMap: Joi.string().allow("").label("Google Map Link"),
  logo: Joi.binary().allow().label("Company Logo"),
  phone: Joi.string().allow("").label("Phone"),
  totalStaff: Joi.string().allow("").label("Total Staff"),
  totalTechnicians: Joi.string().allow("").label("Total Technicians"),
  brands: Joi.any().allow(null).label("Company Brands"),
  workingHours: Joi.string().allow("").label("Working Hours"),
};

@Table({
  timestamps: true,
  tableName: "partners",
})
export default class Partner extends Model<
  InferAttributes<Partner>,
  InferCreationAttributes<Partner>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: "partner_id", allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare slug: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare logo: string;

  @Column(DataType.STRING)
  declare googleMap: string;

  @Column(DataType.STRING)
  declare bankName: string;

  @Column(DataType.STRING)
  declare accountName: string;

  @Column(DataType.STRING)
  declare accountNumber: string;

  @Column(DataType.INTEGER)
  declare totalStaff: number;

  @Column(DataType.INTEGER)
  declare totalTechnicians: number;

  @Column(DataType.ARRAY(DataType.STRING))
  declare brands: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  declare images: string[];

  @Column(DataType.INTEGER)
  declare yearOfIncorporation: number;

  @Column(DataType.STRING)
  declare cac: string;

  @Column(DataType.STRING)
  declare vatNumber: string;

  @Column(DataType.STRING)
  declare workshopAddress: string;

  @Column(DataType.STRING)
  declare nameOfDirector: string;

  @Column(DataType.STRING)
  declare nameOfManager: string;

  @Column(DataType.ARRAY(DataType.STRING))
  declare workingHours: string[];

  @HasOne(() => Contact, { onDelete: "SET NULL" })
  declare contact: NonAttribute<Contact>;

  @HasMany(() => Plan, { onDelete: "SET NULL" })
  declare plans: NonAttribute<Array<Plan>>;

  @HasMany(() => Job, { onDelete: "SET NULL" })
  declare jobs: NonAttribute<Array<Job>>;

  @HasMany(() => User)
  declare users: NonAttribute<Array<User>>;

  @HasMany(() => Estimate)
  declare estimates: NonAttribute<Array<Estimate>>;

  @HasMany(() => Expense)
  declare expenses: NonAttribute<Array<Expense>>;

  @HasMany(() => ServiceReminder)
  declare reminders: NonAttribute<Array<ServiceReminder>>;

  @HasMany(() => ExpenseType)
  declare expenseTypes: NonAttribute<Array<ExpenseType>>;

  @HasMany(() => ReminderType)
  declare reminderTypes: NonAttribute<Array<ReminderType>>;

  @HasOne(() => Preference)
  declare preference: NonAttribute<Preference>;

  @HasOne(() => PartnerAccount)
  declare account: NonAttribute<PartnerAccount>;

  @HasMany(() => Beneficiary)
  declare beneficiaries: NonAttribute<Array<Beneficiary>>;

  @HasMany(() => Role)
  declare roles: NonAttribute<Array<Role>>;

  @BelongsToMany(() => CheckList, () => PartnerCheckList)
  declare checkLists: NonAttribute<
    Array<CheckList & { PartnerCheckList: PartnerCheckList }>
  >;

  @BelongsToMany(() => RideShareDriver, () => PartnerRideShareDriver)
  declare rideShareDrivers: NonAttribute<
    Array<RideShareDriver & { PartnerRideShareDriver: PartnerRideShareDriver }>
  >;

  @BelongsToMany(() => Technician, () => PartnerTechnician)
  declare technicians: NonAttribute<
    Array<Technician & { PartnerTechnician: PartnerTechnician }>
  >;

  @BelongsToMany(() => Category, () => PartnerCategory)
  declare categories: NonAttribute<
    Array<Category & { PartnerCategory: PartnerCategory }>
  >;

  @HasMany(() => Transaction)
  declare transactions: NonAttribute<Transaction[]>;

  @HasMany(() => ItemStock)
  declare itemStocks: NonAttribute<Array<ItemStock>>;

  @Column({ type: DataType.STRING, defaultValue: false })
  declare isAccountProvisioned: CreationOptional<boolean>;

  @Column({ type: DataType.STRING, defaultValue: "NOT_REQUESTED" })
  declare accountProvisionStatus: CreationOptional<string>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare businessCategory: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare businessRegStatus: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare tin: string | null;
  
}
