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
} from "sequelize-typescript";
import { CreationOptional, InferAttributes } from "sequelize/types";
import Contact from "./Contact";
import { InferCreationAttributes, NonAttribute } from "sequelize";
import User from "./User";
import PartnerCategory from "./PartnerCategory";
import Category from "./Category";
import Plan from "./Plan";

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

  @Column(DataType.ARRAY(DataType.STRING))
  declare workingHours: string[];

  @HasOne(() => Contact)
  declare contact: NonAttribute<Contact>;

  @HasMany(() => User)
  declare users: NonAttribute<Array<User>>;

  @HasMany(() => Plan)
  declare plans: NonAttribute<Array<Plan>>;

  @BelongsToMany(() => Category, () => PartnerCategory)
  declare categories: NonAttribute<
    Array<Category & { PartnerCategory: PartnerCategory }>
  >;
}
