import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { appCommonTypes } from "../@types/app-common";
import AppLogger from "../utils/AppLogger";
import HttpStatus from "../helpers/HttpStatus";
import CustomAPIError from "../exceptions/CustomAPIError";
import settings from "../config/settings";
import authorizeRoute from "./authorizeRoute";
import UserRepository from "../repositories/UserRepository";
import AsyncWrapper = appCommonTypes.AsyncWrapper;
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;

const logger = AppLogger.init(authenticateRouteWrapper.name).logger;
const userRepo = new UserRepository();

export default function authenticateRouteWrapper(handler: AsyncWrapper) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (!headers.cookie) {
      logger.error("authorization missing in header");

      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }

    const cookie = headers.cookie;

    if (cookie && !cookie.split("=")[0].startsWith("_admin_auth")) {
      logger.error("malformed authorization: '_admin_auth' missing");

      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }

    const jwt = cookie.split("=")[1];

    const key = settings.jwt.key;

    const payload = verify(jwt, key) as CustomJwtPayload;

    const { userId } = payload;

    const user = await userRepo.findById(userId);

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
