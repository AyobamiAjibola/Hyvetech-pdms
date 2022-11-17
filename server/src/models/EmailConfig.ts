import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';

@Table({
  tableName: 'email_config',

  timestamps: true,
})
export default class EmailConfig extends Model<InferAttributes<EmailConfig>, InferCreationAttributes<EmailConfig>> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.BOOLEAN)
  declare default: boolean;

  @Column(DataType.STRING)
  declare host: string;

  @Column(DataType.STRING)
  declare from: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.BOOLEAN)
  declare secure: boolean;

  @Column(DataType.INTEGER)
  declare port: number;

  @Column(DataType.STRING)
  declare status: string;
}
