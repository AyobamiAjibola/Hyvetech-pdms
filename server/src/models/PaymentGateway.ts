import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: true,

  tableName: "payment_gateways",
})
export default class PaymentGateway extends Model<
  InferAttributes<PaymentGateway>,
  InferCreationAttributes<PaymentGateway>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.STRING)
  declare baseUrl: string;

  @Column(DataType.STRING)
  declare secretKey: string;

  @Column(DataType.STRING)
  declare callBackUrl: string;

  @Column(DataType.STRING)
  declare webHook: string;

  @Column(DataType.BOOLEAN)
  declare default: boolean;
}
