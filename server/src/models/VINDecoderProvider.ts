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

@Table({
  timestamps: true,

  tableName: "vin_decoder_providers",
})
export default class VINDecoderProvider extends Model<
  InferAttributes<VINDecoderProvider>,
  InferCreationAttributes<VINDecoderProvider>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.BOOLEAN)
  declare default: boolean;

  @Column(DataType.STRING)
  declare apiPrefix: string;

  @Column(DataType.STRING)
  declare apiKey: string;

  @Column(DataType.STRING)
  declare apiSecret: string;

  @Column(DataType.STRING)
  declare controlSum: string;
}
