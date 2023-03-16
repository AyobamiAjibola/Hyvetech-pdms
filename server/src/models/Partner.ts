import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreationOptional, InferAttributes } from 'sequelize/types';
import Contact from './Contact';
import { InferCreationAttributes, NonAttribute } from 'sequelize';
import User from './User';
import PartnerCategory from './PartnerCategory';
import Category from './Category';
import Plan from './Plan';
import PartnerRideShareDriver from './PartnerRideShareDriver';
import RideShareDriver from './RideShareDriver';
import Job from './Job';
import Technician from './Technician';
import PartnerTechnician from './PartnerTechnician';
import CheckList from './CheckList';
import PartnerCheckList from './PartnerCheckList';
import Estimate from './Estimate';
import Transaction from './Transaction';
import Expense from './Expense';
import Beneficiary from './Beneficiary';
import ExpenseType from './ExpenseType';

@Table({
  timestamps: true,
  tableName: 'partners',
})
export default class Partner extends Model<InferAttributes<Partner>, InferCreationAttributes<Partner>> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'partner_id', allowNull: false })
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
  declare nameOfDirector: string;

  @Column(DataType.STRING)
  declare nameOfManager: string;

  @Column(DataType.ARRAY(DataType.STRING))
  declare workingHours: string[];

  @HasOne(() => Contact, { onDelete: 'SET NULL' })
  declare contact: NonAttribute<Contact>;

  @HasMany(() => Plan, { onDelete: 'SET NULL' })
  declare plans: NonAttribute<Array<Plan>>;

  @HasMany(() => Job, { onDelete: 'SET NULL' })
  declare jobs: NonAttribute<Array<Job>>;

  @HasMany(() => User)
  declare users: NonAttribute<Array<User>>;

  @HasMany(() => Estimate)
  declare estimates: NonAttribute<Array<Estimate>>;

  @HasMany(() => Expense)
  declare expenses: NonAttribute<Array<Expense>>;

  @HasMany(() => ExpenseType)
  declare expenseTypes: NonAttribute<Array<ExpenseType>>;

  @HasMany(() => Beneficiary)
  declare beneficiaries: NonAttribute<Array<Beneficiary>>;

  @BelongsToMany(() => CheckList, () => PartnerCheckList)
  declare checkLists: NonAttribute<Array<CheckList & { PartnerCheckList: PartnerCheckList }>>;

  @BelongsToMany(() => RideShareDriver, () => PartnerRideShareDriver)
  declare rideShareDrivers: NonAttribute<Array<RideShareDriver & { PartnerRideShareDriver: PartnerRideShareDriver }>>;

  @BelongsToMany(() => Technician, () => PartnerTechnician)
  declare technicians: NonAttribute<Array<Technician & { PartnerTechnician: PartnerTechnician }>>;

  @BelongsToMany(() => Category, () => PartnerCategory)
  declare categories: NonAttribute<Array<Category & { PartnerCategory: PartnerCategory }>>;

  @HasMany(() => Transaction)
  declare transactions: NonAttribute<Transaction[]>;
}
