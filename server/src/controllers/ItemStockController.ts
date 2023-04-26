import { Request } from 'express';
import Joi from 'joi';
import ItemStock, {
    $addStockSchema,
    $createItemStockSchema,
    $updateItemStockSchema,
    ItemStockSchemaType
} from '../models/ItemStock';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import dataSources from '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import { HasPermission, TryCatch } from '../decorators';
import { CreationAttributes } from 'sequelize/types';
import { Op } from 'sequelize';
import HttpResponse = appCommonTypes.HttpResponse;
import { appEventEmitter } from '../services/AppEventEmitter';
import { CREATED_ITEMSTOCK } from '../config/constants';
import Partner from '../models/Partner';
import Generic from '../utils/Generic';

export default class ItemStockController {
    @TryCatch
  public async create(req: Request) {
        const { itemStock, partner } = await this.doCreateItemStock(req);

        appEventEmitter.emit(CREATED_ITEMSTOCK, { itemStock, partner });

        const response: HttpResponse<ItemStock> = {
            code: HttpStatus.OK.code,
            message: 'Item created successfully.',
            result: itemStock
        };

        return Promise.resolve(response);
  }

    @TryCatch
//   @HasPermission([MANAGE_TECHNICIAN, CREATE_ESTIMATE, DELETE_ESTIMATE])
  public async delete(req: Request) {
    const itemId = req.params.itemId as string;

    const item = await dataSources.itemStockDAOService.findById(+itemId);

    // const estimates = await dataSources.estimateDAOService.findAll({
    //   //@ts-ignore
    //   where: {partnerId: req.user.partner.id}
    // });

    // let partNumbers: any = [];
    // for( const estimate of estimates ) {
    //   //@ts-ignore
    //   estimate.parts.forEach(element => {
    //     const object = JSON.parse(element)
    //     if(object.partNumber) {
    //       partNumbers.push(object.partNumber)
    //     }
    //   });
    // }

    // const isPartNum = partNumbers.find((item: any) => item === item.slug)
    // if(isPartNum) {
    //   return Promise.reject(CustomAPIError.response(`Item can not be deleted.`, HttpStatus.NOT_FOUND.code));
    // }

    if (!item) return Promise.reject(CustomAPIError.response(`Item not found`, HttpStatus.NOT_FOUND.code));

    await ItemStock.destroy({ where: { id: +itemId }, force: true });

    return Promise.resolve({
      code: HttpStatus.ACCEPTED.code,
      message: 'Item deleted successfully',
    } as HttpResponse<void>);
  }

  @TryCatch
//   @HasPermission([MANAGE_TECHNICIAN, CREATE_ESTIMATE, UPDATE_ESTIMATE])
  public async update(req: Request) {
    const { item } = await this.doUpdateItem(req);

    const response: HttpResponse<ItemStock> = {
      code: HttpStatus.OK.code,
      message: 'Item updated successfully.',
      result: item,
    };

    return Promise.resolve(response);
  }

  @TryCatch
  //   @HasPermission([MANAGE_TECHNICIAN, CREATE_ESTIMATE, UPDATE_ESTIMATE])
  public async addStock(req: Request) {
      const { item } = await this.doAddStock(req);

      const response: HttpResponse<ItemStock> = {
        code: HttpStatus.OK.code,
        message: 'Item stock updated successfully.',
        result: item,
      };

      return Promise.resolve(response);
  }

  @TryCatch
//   @HasPermission([MANAGE_ALL, MANAGE_TECHNICIAN, CREATE_ESTIMATE, READ_ESTIMATE, DELETE_ESTIMATE])
  public async items(req: Request) {
    const partner = req.user.partner;

    let items: ItemStock[];

    items = await partner.$get('itemStocks', {
    include: [
        Partner
    ],
    });


    // sort by date created
    for (let i = 1; i < items.length; i++) {
      for (let j = i; j > 0; j--) {
        const _t1: any = items[j];
        const _t0: any = items[j - 1];

        if (new Date(_t1.updatedAt).getTime() > new Date(_t0.updatedAt).getTime()) {
          items[j] = _t0;
          items[j - 1] = _t1;
          // console.log('sorted')
        } else {
          // console.log('no sorted')
        }
      }
    }

    const response: HttpResponse<ItemStock> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      results: items,
    };

    return Promise.resolve(response);
  }

  private async doAddStock(req: Request) {
    const itemId = req.params.itemId as string;

    const item = await dataSources.itemStockDAOService.findById(+itemId);
    if (!item) return Promise.reject(CustomAPIError.response(`Item not found`, HttpStatus.NOT_FOUND.code));

    const { error, value } = Joi.object<ItemStockSchemaType>($addStockSchema).validate(req.body);
    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
    );

    const addStockPart: Partial<ItemStock> = {
        unit: value.unit,
        buyingPrice: value.buyingPrice,
        quantity: item.quantity + value.quantity
    }

    await item.update(addStockPart)

    return { item }
  }

  private async doUpdateItem(req: Request) {
    const itemId = req.params.itemId as string;

    const item = await dataSources.itemStockDAOService.findById(+itemId);
    if (!item) return Promise.reject(CustomAPIError.response(`Item not found`, HttpStatus.NOT_FOUND.code));

    const { error, value } = Joi.object<ItemStockSchemaType>($updateItemStockSchema).validate(req.body);
    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
        CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const fetchItem = await dataSources.itemStockDAOService.findById(value.id);

    const slug = Generic.generateSlug(value.partNumber);
    // const itemSlug = await dataSources.itemStockDAOService.findByAny({where: {slug}});
    if (fetchItem?.slug !== slug) {
      if(slug) {
        return Promise.reject(
          CustomAPIError.response(`The Part/Service already exist`, HttpStatus.NOT_FOUND.code),
        );
      }
    }

    const itemStockValues: Partial<ItemStock> = {
        name: value.name,
        description: value.description,
        type: value.type,
        unit: value.unit,
        buyingPrice: value.buyingPrice,
        sellingPrice: value.sellingPrice,
        partNumber: value.partNumber
    }

    await item.update(itemStockValues)

    return { item }
  }

  private async doCreateItemStock(req: Request) {
    const { error, value } = Joi.object<ItemStockSchemaType>($createItemStockSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    if (!value)
      return Promise.reject(
          CustomAPIError.response(HttpStatus.INTERNAL_SERVER_ERROR.value, HttpStatus.INTERNAL_SERVER_ERROR.code),
      );

    const partner = await dataSources.partnerDAOService.findById(req.user.partner.id);

    if (!partner)
      return Promise.reject(
          CustomAPIError.response(`Partner with Id: ${value.id} does not exist`, HttpStatus.NOT_FOUND.code),
      );

    const slug = Generic.generateSlug(value.partNumber);
    const item = await dataSources.itemStockDAOService.findByAny({where: {slug}});
    if (item && value.type === 'part')
      return Promise.reject(
        CustomAPIError.response(`Part Number already exist`, HttpStatus.NOT_FOUND.code),
      );

    const itemStockValues: Partial<ItemStock> = {
        name: value.name,
        description: value.description,
        type: value.type,
        unit: value.unit,
        buyingPrice: value.buyingPrice,
        sellingPrice: value.sellingPrice,
        quantity: value.quantity,
        partNumber: value.partNumber,
        slug: Generic.generateSlug(value.partNumber)
    }

    const itemStock = await dataSources.itemStockDAOService.create(itemStockValues as CreationAttributes<ItemStock>)
    await partner.$add('itemStocks', [itemStock]);

    return { itemStock, partner }
  }
}
