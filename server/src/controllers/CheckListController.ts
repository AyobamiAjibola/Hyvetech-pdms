import { Request } from "express";
import Joi from "joi";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import { appCommonTypes } from "../@types/app-common";
import CheckList from "../models/CheckList";
import { InferAttributes } from "sequelize";
import HttpResponse = appCommonTypes.HttpResponse;

export default class CheckListController {
  public static async create(req: Request) {
    try {
      const { error, value } = Joi.object({
        partner: Joi.string().required().label("Partner Id"),
        checkList: Joi.string().required().label("Check List Name"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partnerId = value.partner as string;
      const name = value.checkList;

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const exist = await dataSources.checkListDAOService.findByAny({
        where: { name },
      });

      if (exist)
        return Promise.reject(
          CustomAPIError.response(
            `Check list with name already exist`,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const data: any = { name };

      const checkList = await dataSources.checkListDAOService.create(data);

      await partner.$set("checkLists", [checkList]);

      const checkLists = await dataSources.checkListDAOService.findAll({
        include: [{ all: true }],
      });

      const results = checkLists.map((checkList) => checkList.toJSON());

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: `Created Check List Successfully`,
        results,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async checkLists() {
    try {
      const checkLists = await dataSources.checkListDAOService.findAll({
        include: [{ all: true }],
      });

      const results = checkLists.map((checkList) => checkList.toJSON());

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async checkList(req: Request) {
    const checkListId = req.params.checkListId as string;

    try {
      const checkList = await dataSources.checkListDAOService.findById(
        +checkListId,
        {
          include: [{ all: true }],
        }
      );

      if (!checkList)
        return Promise.reject(
          CustomAPIError.response(
            `Check List not found`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const result = checkList.toJSON();

      const response: HttpResponse<InferAttributes<CheckList>> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
