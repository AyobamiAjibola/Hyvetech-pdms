import { Request } from "express";

import dataSources from "../services/dao";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import Partner from "../models/Partner";
import { appCommonTypes } from "../@types/app-common";

import User from "../models/User";
import HttpResponse = appCommonTypes.HttpResponse;

export default class UserController {
  public static async user(req: Request) {
    const userId = req.params.userId as string;
    try {
      const user = await dataSources.userDAOService.findById(+userId, {
        include: [Partner],
      });

      if (!user)
        return Promise.reject(
          CustomAPIError.response(`User with Id: ${userId} does not exist`, HttpStatus.NOT_FOUND.code)
        );

      const response: HttpResponse<User> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: user,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public static async users() {
    try {
      const users = await dataSources.userDAOService.findAll({
        include: [{ all: true }],
      });

      const response: HttpResponse<User> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: users,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
