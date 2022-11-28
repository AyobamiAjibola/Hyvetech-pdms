import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import Estimate from './Estimate';
import BillingInformation from './BillingInformation';

@Table({
  timestamps: false,
  tableName: 'estimate_billing_information',
})
export default class EstimateBillingInformation extends Model<
  InferAttributes<EstimateBillingInformation>,
  InferCreationAttributes<EstimateBillingInformation>
> {
  @ForeignKey(() => Estimate)
  @Column(DataType.INTEGER)
  declare estimateId: number;

  @ForeignKey(() => BillingInformation)
  @Column(DataType.INTEGER)
  declare billingInfoId: number;
}
