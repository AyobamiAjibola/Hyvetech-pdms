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
        partnerId: Joi.string().required().label("Partner Id"),
        name: Joi.string().required().label("Check List Name"),
      }).validate(req.body);

      if (error)
        return Promise.reject(
          CustomAPIError.response(
            error.details[0].message,
            HttpStatus.BAD_REQUEST.code
          )
        );

      const partnerId = value.partnerId as string;

      const partner = await dataSources.partnerDAOService.findById(+partnerId);

      if (!partner)
        return Promise.reject(
          CustomAPIError.response(
            `Partner does not exist`,
            HttpStatus.NOT_FOUND.code
          )
        );

      const checkList = await dataSources.checkListDAOService.create(value);

      await partner.$set("checkLists", [checkList]);

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
