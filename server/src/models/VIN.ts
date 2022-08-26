import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

@Table({ tableName: "vins", timestamps: true })
export default class VIN extends Model<
  InferAttributes<VIN>,
  InferCreationAttributes<VIN>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare vin: string;

  @Column(DataType.STRING)
  declare model: string;

  @Column(DataType.STRING)
  declare make: string;

  @Column(DataType.STRING)
  declare engineCylinders: string;

  @Column(DataType.STRING)
  declare modelYear: string;

  @Column(DataType.STRING)
  declare engineModel: string;

  @Column(DataType.STRING)
  declare displacementCc: string;

  @Column(DataType.STRING)
  declare engineDisplacementCcm: string;

  @Column(DataType.STRING)
  declare fuelTypePrimary: string;

  @Column(DataType.STRING)
  declare plantCountry: string;
}
