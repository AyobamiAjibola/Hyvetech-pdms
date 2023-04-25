import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Attributes, CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import Partner from './Partner';
import Joi from 'joi';

export type ItemStockSchemaType = Attributes<ItemStock & Partner>;
export const itemFields = {
    name: {
      name: 'name',
      label: 'name',
      error: {
        invalid: 'Name is required',
        required: 'Name is required',
      },
    },
    description: {
      name: 'Item Description',
      label: 'description',
      error: {
        invalid: 'Item Description is invalid',
        required: 'Item Description is required',
      },
    },
    type: {
      name: 'Item Type',
      label: 'type',
      error: {
        invalid: 'Item Type is invalid',
        required: 'Item Type is required',
      },
    },
    buyingPrice: {
      name: 'Buying Price',
      label: 'buyingPrice',
      error: {
        invalid: 'Buying Price is invalid',
        required: 'Buying Price is required',
      },
    },
    sellingPrice: {
      name: 'Selling Price',
      label: 'sellingPrice',
      error: {
        invalid: 'Selling Price is invalid',
        required: 'Selling Price is required',
      }
    },
    unit: {
      name: 'Unit',
      label: 'unit',
      error: {
        invalid: 'Unit is invalid',
        required: 'Unit is required',
      },
    },
    quantity: {
      name: 'Quantity',
      label: 'quantity',
      error: {
        invalid: 'Quantity is invalid',
        required: 'Quantity is required',
      },
    },
    partNumber: {
      name: 'Part Number',
      label: 'partNumber',
      error: {
        invalid: 'Part Number is invalid',
        required: 'Part Number is required',
      },
    },
};

export const $createItemStockSchema: Joi.SchemaMap<ItemStockSchemaType> = {
    id: Joi.number().required().label('Partner Id'),
    name: Joi.string().required().label(itemFields.name.label),
    description: Joi.string().allow('').optional().label(itemFields.description.label),
    type: Joi.string().required().label(itemFields.type.label),
    partNumber: Joi.when('type', {
      is: 'part',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('')
    }).required().label(itemFields.partNumber.label),
    sellingPrice: Joi.number().required().label(itemFields.sellingPrice.label),
    buyingPrice: Joi.number().allow(null).optional().label(itemFields.buyingPrice.label),
    unit: Joi.string().allow('').optional().label(itemFields.unit.label),
    quantity: Joi.number().allow(null).optional().label(itemFields.quantity.label),
};

export const $updateItemStockSchema: Joi.SchemaMap<ItemStockSchemaType> = {
    id: Joi.number().required().label('Partner Id'),
    name: Joi.string().required().label(itemFields.name.label),
    description: Joi.string().allow('').optional().label(itemFields.description.label),
    type: Joi.string().valid('part', 'service').required().label(itemFields.type.label),
    buyingPrice: Joi.number().allow(null).optional().label(itemFields.buyingPrice.label),
    sellingPrice: Joi.number().required().label(itemFields.sellingPrice.label),
    unit: Joi.when('type', {
      is: 'part',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('')
    }).label(itemFields.unit.label),
    quantity: Joi.number().allow(null).optional().label(itemFields.quantity.label),
    partNumber: Joi.when('type', {
      is: 'part',
      then: Joi.string().required(),
      otherwise: Joi.string().allow('')
    }).required().label(itemFields.partNumber.label),
};

export const $addStockSchema: Joi.SchemaMap<ItemStockSchemaType> = {
  id: Joi.number().required().label('Item Id'),
  quantity: Joi.number().required().label(itemFields.quantity.label),
};

@Table({
    timestamps: true,
    tableName: 'itemStocks',
    paranoid: true,
})

export default class ItemStock extends Model<InferAttributes<ItemStock>, InferCreationAttributes<ItemStock>> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'itemStock_id', allowNull: false })
    declare id: CreationOptional<number>;

    @Column(DataType.STRING)
    declare name: string;

    @Column(DataType.STRING)
    declare slug: string;

    @Column(DataType.STRING)
    declare description: string;

    @Column(DataType.STRING)
    declare type: string;

    @Column(DataType.STRING)
    declare partNumber: string;

    @Column(DataType.DOUBLE)
    declare buyingPrice: number;

    @Column(DataType.DOUBLE)
    declare sellingPrice: number;

    @Column(DataType.STRING)
    declare unit: string;

    @Column(DataType.INTEGER)
    declare quantity: number;

    @BelongsTo(() => Partner, { onDelete: 'CASCADE' })
    declare partner: NonAttribute<Partner>;

    @ForeignKey(() => Partner)
    @Column(DataType.INTEGER)
    declare partnerId: NonAttribute<number>;
  }