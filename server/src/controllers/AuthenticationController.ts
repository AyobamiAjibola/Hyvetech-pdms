import { Request } from 'express';

import Joi from 'joi';

import { appCommonTypes } from '../@types/app-common';
import User, { $loginSchema, $userSchema } from '../models/User';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Generic from '../utils/Generic';
import { InferAttributes } from 'sequelize/types';
import QueueManager from '../services/QueueManager';
import email_content from '../resources/templates/email/email_content';
import create_customer_success_email from '../resources/templates/email/create_customer_success_email';
import { QUEUE_EVENTS } from '../config/constants';
import dataSources from '../services/dao';
import settings from '../config/settings';
import { Op } from 'sequelize';
import Permission from '../models/Permission';
import Partner from '../models/Partner';
import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class AuthenticationController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * @name signup
   * @param req
   */
  public async signup(req: Request) {
    try {
      const { error, value } = Joi.object($userSchema).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const userExist = await dataSources.userDAOService.findByAny({
        where: {
          [Op.or]: [{ email: value.email, phone: value.phone }],
        },
      });

      if (userExist)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: value.role },
      });

      if (!role) return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

      value.password = Generic.generateRandomString(15);

      const user = await dataSources.userDAOService.create(value);

      //associate user with role
      await user.$set('roles', [role]);

      const platforms = value.companyName.split(',');

      for (const platform of platforms) {
        const partner = await dataSources.partnerDAOService.findByAny({
          where: { name: platform },
        });

        if (!partner)
          return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

        await partner.$add('users', [user]);
      }

      const mailText = create_customer_success_email({
        username: user.email,
        password: user.password,
        loginUrl: process.env.CUSTOMER_APP_HOST,
      });

      const mail = email_content({
        firstName: user?.firstName,
        text: mailText,
        signature: process.env.SMTP_EMAIL_SIGNATURE,
      });

      //todo: Send email with credentials
      await QueueManager.dispatch({
        queue: QUEUE_EVENTS.name,
        data: {
          to: user.email,
          from: {
            name: <string>process.env.SMTP_EMAIL_FROM_NAME,
            address: <string>process.env.SMTP_EMAIL_FROM,
          },
          subject: `Welcome to Jiffix ${value.companyName}`,
          html: mail,
          bcc: [<string>process.env.SMTP_CUSTOMER_CARE_EMAIL, <string>process.env.SMTP_EMAIL_FROM],
        },
      });

      const response: HttpResponse<User> = {
        message: `User created successfully`,
        code: HttpStatus.OK.code,
        result: user,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name signIn
   * @param req
   */
  public async signIn(req: Request) {
    try {
      //validate request body
      const { error, value } = Joi.object($loginSchema).validate(req.body);

      if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      //find user by username
      const user = await dataSources.userDAOService.findByUsername(value.username, { include: [Partner] });

      if (!user)
        return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      //verify password
      const hash = user.password;
      const password = value.password;

      const isMatch = await this.passwordEncoder.match(password, hash);

      if (!isMatch)
        return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      const roles = await user.$get('roles', {
        include: [
          {
            model: Permission,
            attributes: ['action', 'subject'],
            through: { attributes: [] },
          },
        ],
      });

      if (!roles.length)
        return Promise.reject(CustomAPIError.response(`Roles does not exist`, HttpStatus.UNAUTHORIZED.code));

      const permissions = [];

      for (const role of roles) {
        for (const _permission of role.permissions) {
          permissions.push(_permission.toJSON());
        }
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: user.id,
        partnerId: user.partnerId,
        permissions,
      });

      //update user authentication date and authentication token
      const updateValues = {
        loginDate: new Date(),
        loginToken: jwt,
      };

      await dataSources.userDAOService.update(user, <InferAttributes<User>>updateValues);

      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
        message: 'Login successful',
        result: jwt,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name bootstrap
   * @description generate authentication token for anonymous users
   */

  public async bootstrap() {
    try {
      const user = await dataSources.userDAOService.findByAny({
        where: {
          username: 'guest',
        },
      });

      if (user) {
        const roles = await user.$get('roles');

        const permissions = [];

        for (const role of roles) {
          const _permissions = await role.$get('permissions', {
            attributes: ['action', 'subject'],
          });

          for (const _permission of _permissions) {
            permissions.push(_permission.toJSON());
          }
        }

        //generate JWT
        const jwt = Generic.generateJwt({
          userId: user.id,
          permissions,
        });

        await user.update({
          loginDate: new Date(),
          loginToken: jwt,
        });

        const response: HttpResponse<string> = {
          message: HttpStatus.OK.value,
          code: HttpStatus.OK.code,
          result: jwt,
        };

        return Promise.resolve(response);
      }

      const rawPassword = process.env.BOOTSTRAP_PASS;

      if (undefined === rawPassword)
        return Promise.reject(CustomAPIError.response(HttpStatus.BAD_REQUEST.value, HttpStatus.BAD_REQUEST.code));

      //find role by name
      const role = await dataSources.roleDAOService.findByAny({
        where: { slug: settings.roles[2] },
      });

      if (!role) return Promise.reject(CustomAPIError.response(HttpStatus.NOT_FOUND.value, HttpStatus.NOT_FOUND.code));

      const hash = await this.passwordEncoder.encode(rawPassword);

      const guestUser: any = {
        firstName: 'Anonymous',
        lastName: 'Anonymous',
        username: 'guest',
        password: hash,
      };

      const created = await dataSources.userDAOService.create(guestUser);
      await created.$add('roles', [role]);

      const roles = await created.$get('roles');

      const permissions = [];

      for (const role of roles) {
        const _permissions = await role.$get('permissions', {
          attributes: ['action', 'subject'],
        });

        for (const _permission of _permissions) {
          permissions.push(_permission.toJSON());
        }
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: created.id,
        permissions,
      });

      await created.update({
        loginDate: new Date(),
        loginToken: jwt,
      });

      const response: HttpResponse<string> = {
        message: HttpStatus.OK.value,
        code: HttpStatus.OK.code,
        result: jwt,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @name signOut
   * @param req
   */

  public async signOut(req: Request) {
    try {
      await req.user.update({ loginToken: '' });

      const response: HttpResponse<null> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
      };

      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
