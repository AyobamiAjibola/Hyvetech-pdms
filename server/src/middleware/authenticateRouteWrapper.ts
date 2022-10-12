import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { appCommonTypes } from "../@types/app-common";
import AppLogger from "../utils/AppLogger";
import HttpStatus from "../helpers/HttpStatus";
import CustomAPIError from "../exceptions/CustomAPIError";
import settings from "../config/settings";
import authorizeRoute from "./authorizeRoute";
import UserRepository from "../repositories/UserRepository";
import Role from "../models/Role";
import Partner from "../models/Partner";
import AsyncWrapper = appCommonTypes.AsyncWrapper;
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;

const logger = AppLogger.init(authenticateRouteWrapper.name).logger;
const userRepo = new UserRepository();

export default function authenticateRouteWrapper(handler: AsyncWrapper) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    const cookie = headers.cookie;
    const authorization = headers.authorization;
    const key = settings.jwt.key;
    let jwt = "";

    if (cookie) {
      if (!cookie.split("=")[0].startsWith("_admin_auth")) {
        logger.error("malformed authorization: '_admin_auth' missing");

        return next(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );
      }

      jwt = cookie.split("=")[1];
    }

    if (authorization) {
      if (!authorization.startsWith("Bearer")) {
        logger.error("malformed authorization: 'Bearer' missing");

        return next(
          CustomAPIError.response(
            HttpStatus.UNAUTHORIZED.value,
            HttpStatus.UNAUTHORIZED.code
          )
        );
      }

      jwt = authorization.split(" ")[1].trim();
    }

    const payload = verify(jwt, key) as CustomJwtPayload;

    const { userId } = payload;

    const user = await userRepo.findById(userId, {
      include: [Role, Partner],
    });

    if (!user) {
      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }

    req.permissions = payload.permissions;
    req.user = user;
    req.jwt = jwt;

    const authorised = await authorizeRoute(req);

    if (!authorised)
      return next(
        CustomAPIError.response(
          HttpStatus.FORBIDDEN.value,
          HttpStatus.FORBIDDEN.code
        )
      );

    await handler(req, res, next);
  };
}
