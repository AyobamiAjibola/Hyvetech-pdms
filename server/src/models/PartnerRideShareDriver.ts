import {AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table,} from "sequelize-typescript";
import {CreationOptional, InferAttributes, InferCreationAttributes,} from "sequelize";
import Partner from "./Partner";
import RideShareDriver from "./RideShareDriver";

@Table({
    timestamps: false,
    tableName: "partner_ride_share_drivers",
})
export default class PartnerRideShareDriver extends Model<InferAttributes<PartnerRideShareDriver>,
    InferCreationAttributes<PartnerRideShareDriver>> {
    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.INTEGER})
    declare id: CreationOptional<number>;

    @ForeignKey(() => Partner)
    @Column({type: DataType.INTEGER})
    declare partnerId: number;

    @ForeignKey(() => RideShareDriver)
    @Column({type: DataType.INTEGER})
    declare rideShareDriverId: number;
}
