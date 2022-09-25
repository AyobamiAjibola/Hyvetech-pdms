import { NextFunction, Request, Response } from "express";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import settings from "../config/settings";
import { verify } from "jsonwebtoken";
import authorizeRoute from "./authorizeRoute";
import { appCommonTypes } from "../@types/app-common";
import AppLogger from "../utils/AppLogger";
import UserRepository from "../repositories/UserRepository";
import CustomerRepository from "../repositories/CustomerRepository";
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;

const logger = AppLogger.init(authenticateRoute.name).logger;
const userRepo = new UserRepository();
const customerRepo = new CustomerRepository();

export default async function authenticateRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers;
  const cookie = headers.cookie;
  const authorization = headers.authorization;
  let jwt;

  if (!cookie) {
    logger.error("cookie missing in header");

    return next(
      CustomAPIError.response(
        HttpStatus.UNAUTHORIZED.value,
        HttpStatus.UNAUTHORIZED.code
      )
    );
  }

  if (cookie && !cookie.split("=")[0].startsWith("_admin_auth")) {
    logger.error("malformed authorization: '_admin_auth' missing");

    return next(
      CustomAPIError.response(
        HttpStatus.UNAUTHORIZED.value,
        HttpStatus.UNAUTHORIZED.code
      )
    );
  }

  jwt = cookie.split("=")[1];

  if (authorization) {
    if (!authorization.startsWith("Bearer")) {
      logger.error("malformed token: no Bearer in header");

      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }

    jwt = authorization.split(" ")[1].trim();
  }

  const key = settings.jwt.key;

  const payload = verify(jwt, key) as CustomJwtPayload;

  if (payload.userId) {
    const user = await userRepo.findById(payload.userId);

    if (!user) {
      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }
  }

  if (payload.customer) {
    const customer = await customerRepo.findById(payload.customer);

    if (!customer) {
      return next(
        CustomAPIError.response(
          HttpStatus.UNAUTHORIZED.value,
          HttpStatus.UNAUTHORIZED.code
        )
      );
    }
  }

  req.permissions = payload.permissions;

  const authorised = await authorizeRoute(req);

  if (!authorised)
    return next(
      CustomAPIError.response(
        HttpStatus.FORBIDDEN.value,
        HttpStatus.FORBIDDEN.code
      )
    );

  next();
}
