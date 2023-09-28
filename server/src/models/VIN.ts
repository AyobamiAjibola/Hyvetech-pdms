import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'vins', timestamps: true })
export default class VIN extends Model<InferAttributes<VIN>, InferCreationAttributes<VIN>> {
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

  @Column(DataType.STRING)
  declare plateNumber: string;

  @Column(DataType.STRING)
  declare series: string;

  @Column(DataType.STRING)
  declare bodyClass: string;

  @Column(DataType.STRING)
  declare driveType: string;

  @Column(DataType.STRING)
  declare vehicleType: string;

  @Column(DataType.STRING)
  declare engineHP: string;

  @Column(DataType.STRING)
  declare engineKW: string;

  @Column(DataType.STRING)
  declare transmissionSpeeds: string;

  @Column(DataType.STRING)
  declare transmissionStyle: string;

  @Column(DataType.STRING)
  declare manufacturer: string;

  @Column(DataType.STRING)
  declare plantCity: string;

  @Column(DataType.STRING)
  declare plantCompanyName: string;

  @Column(DataType.STRING)
  declare plantState: string;

  @Column(DataType.STRING)
  declare manufacturerAddress: string;

  @Column(DataType.STRING)
  declare seatBeltsAll: string;

  @Column(DataType.STRING)
  declare rearAutomaticEmergencyBraking: string;

  @Column(DataType.STRING)
  declare doors: string;

  @Column(DataType.STRING)
  declare semiautomaticHeadlampBeamSwitching: string;

  @Column(DataType.STRING)
  declare driverAssist: string;

  @Column(DataType.STRING)
  declare dynamicBrakeSupport: string;

  @Column(DataType.STRING)
  declare seats: string;

  @Column(DataType.STRING)
  declare brakeSystemDesc: string;

  @Column(DataType.STRING)
  declare steeringLocation: string;

  @Column(DataType.STRING)
  declare wheelBaseType: string;

  @Column(DataType.STRING)
  declare wheelSizeFront: string;

  @Column(DataType.STRING)
  declare wheelSizeRear: string;

  @Column(DataType.STRING)
  declare wheels: string;

  @Column(DataType.STRING)
  declare windows: string;
}
