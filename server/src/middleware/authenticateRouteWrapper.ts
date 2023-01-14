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
import cookieParser = require('cookie-parser');
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;
import AsyncWrapper = appCommonTypes.AsyncWrapper;

const logger = AppLogger.init(authenticateRouteWrapper.name).logger;
const userRepository = new UserRepository();
const technicianRepository = new TechnicianRepository();
const customerRepository = new CustomerRepository();
const rideShareDriverRepository = new RideShareDriverRepository();

export default function authenticateRouteWrapper(handler: AsyncWrapper) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    console.log(req)

    const authorization = headers.authorization;
    const cookies = req.signedCookies;
    const key = settings.jwt.key;
    const cookieName = settings.cookie.name;

    const cookie = cookies[cookieName];

    if (cookie) {

      const jwt = cookieParser.signedCookie(cookie, settings.cookie.secret);

      if (false === jwt) {
        logger.error(`malformed authorization: invalid cookie`);

        return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
      }

      const payload = verify(jwt, key) as CustomJwtPayload;

      req.permissions = payload.permissions;
      req.jwt = jwt;

      if (payload.rideShareDriverId) {
        const { rideShareDriverId } = payload;

        const rideShareDriver = await rideShareDriverRepository.findById(rideShareDriverId, {
          include: [Role, Partner],
        });

        if (rideShareDriver) return await handler(req, res, next);
      }

      if (payload.userId) {
        const { userId } = payload;

        const user = await userRepository.findById(userId, {
          include: [Role, Partner],
        });

        if (user) {
          req.user = user;

          return await handler(req, res, next);
        }

        const technician = await technicianRepository.findById(userId, {
          include: [Role, Partner],
        });

        if (technician) return await handler(req, res, next);

        const customer = await customerRepository.findById(userId, {
          include: [Role],
        });

        if (customer) return await handler(req, res, next);
      }
    }

    if (authorization) {
      if (!authorization.startsWith('Bearer')) {
        logger.error(`malformed authorization: 'Bearer' missing`);

        return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
      }

      const jwt = authorization.split(' ')[1].trim();

      const payload = verify(jwt, key) as CustomJwtPayload;

      req.permissions = payload.permissions;
      req.jwt = jwt;

      if (payload.rideShareDriverId) {
        const { rideShareDriverId } = payload;

        const rideShareDriver = await rideShareDriverRepository.findById(rideShareDriverId, {
          include: [Role, Partner],
        });

        if (rideShareDriver) return await handler(req, res, next);
      }

      if (payload.userId) {
        const { userId } = payload;

        const user = await userRepository.findById(userId, {
          include: [Role, Partner],
        });

        if (user) {
          req.user = user;

          return await handler(req, res, next);
        }

        const technician = await technicianRepository.findById(userId, {
          include: [Role, Partner],
        });

        if (technician) return await handler(req, res, next);

        const customer = await customerRepository.findById(userId, {
          include: [Role],
        });

        if (customer) return await handler(req, res, next);
      }
    }

    return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
  };
}
