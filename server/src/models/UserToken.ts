import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {CreationOptional, InferAttributes, InferCreationAttributes} from 'sequelize/types';

@Table({
    timestamps: true,
    tableName: 'userTokens',
})

export default class UserToken extends Model<InferAttributes<UserToken>, InferCreationAttributes<UserToken>> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: "userToken_id" })
    declare id: CreationOptional<number>;

    @Column({type: DataType.TEXT, allowNull: false})
    declare token: string;

    @Column(DataType.DATE)
    declare expired_at: Date;

    @Column({type: DataType.INTEGER, allowNull: false})
    declare userId: number;

    // @BelongsTo(() => User)
    // declare user: NonAttribute<User>;

    // @ForeignKey(() => User)
    // @Column(DataType.INTEGER)
    // declare userId: CreationOptional<number>;
  }