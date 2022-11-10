import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { InferAttributes } from "sequelize/types";
import { InferCreationAttributes } from "sequelize";
import Partner from "./Partner";
import CheckList from "./CheckList";

@Table({
  tableName: "partner_check_lists",
  timestamps: false,
})
export default class PartnerCheckList extends Model<
  InferAttributes<PartnerCheckList>,
  InferCreationAttributes<PartnerCheckList>
> {
  @ForeignKey(() => Partner)
  @Column(DataType.INTEGER)
  declare partnerId: number;

  @ForeignKey(() => CheckList)
  @Column(DataType.INTEGER)
  declare checkListId: number;
}
