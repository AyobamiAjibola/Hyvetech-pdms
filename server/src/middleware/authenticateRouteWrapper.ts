import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { appCommonTypes } from '../@types/app-common';
import AppLogger from '../utils/AppLogger';
import HttpStatus from '../helpers/HttpStatus';
import CustomAPIError from '../exceptions/CustomAPIError';
import settings from '../config/settings';
import UserRepository from '../repositories/UserRepository';
import Role from '../models/Role';
import Partner from '../models/Partner';
import TechnicianRepository from '../repositories/TechnicianRepository';
import CustomerRepository from '../repositories/CustomerRepository';
import RideShareDriverRepository from '../repositories/RideShareDriverRepository';
import AsyncWrapper = appCommonTypes.AsyncWrapper;
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;

const logger = AppLogger.init(authenticateRouteWrapper.name).logger;
const userRepository = new UserRepository();
const technicianRepository = new TechnicianRepository();
const customerRepository = new CustomerRepository();
const rideShareDriverRepository = new RideShareDriverRepository();

export default function authenticateRouteWrapper(handler: AsyncWrapper) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    const cookie = headers.cookie;
    const authorization = headers.authorization;
    const key = settings.jwt.key;
    let jwt = '';

    if (cookie) {
      if (!cookie.split('=')[0].startsWith('_admin_auth')) {
        logger.error("malformed authorization: '_admin_auth' missing");

        return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
      }

      jwt = cookie.split('=')[1];
    }

    if (authorization) {
      if (!authorization.startsWith('Bearer')) {
        logger.error("malformed authorization: 'Bearer' missing");

        return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
      }

      jwt = authorization.split(' ')[1].trim();
    }

    const payload = verify(jwt, key) as CustomJwtPayload;

    if (payload.rideShareDriverId) {
      const { rideShareDriverId } = payload;

      const rideShareDriver = await rideShareDriverRepository.findById(rideShareDriverId, {
        include: [Role, Partner],
      });

      if (rideShareDriver) {
        req.permissions = payload.permissions;
        req.jwt = jwt;

        return await handler(req, res, next);
      }
    }

    if (payload.userId) {
      const { userId } = payload;

      const user = await userRepository.findById(userId, {
        include: [Role, Partner],
      });

      if (user) {
        req.permissions = payload.permissions;
        req.user = user;
        req.jwt = jwt;

        return await handler(req, res, next);
      }

      const technician = await technicianRepository.findById(userId, {
        include: [Role, Partner],
      });

      if (technician) {
        req.permissions = payload.permissions;
        req.jwt = jwt;

        return await handler(req, res, next);
      }

      const customer = await customerRepository.findById(userId, {
        include: [Role],
      });

      if (customer) {
        req.permissions = payload.permissions;
        req.jwt = jwt;

        return await handler(req, res, next);
      }
    }

    return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
  };
}
