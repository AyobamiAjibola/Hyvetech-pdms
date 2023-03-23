import { Request } from 'express';

import dataSources from '../services/dao';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Partner from '../models/Partner';
import { appCommonTypes } from '../@types/app-common';

import User, { $saveUserSchema, UserSchemaType } from '../models/User';

import Contact from '../models/Contact';
import Joi = require('joi');
import { CreationAttributes } from 'sequelize';
import { HasPermission, TryCatch } from '../decorators';
import { CREATE_USER, DELETE_USER, MANAGE_TECHNICIAN, READ_USER, UPDATE_USER } from '../config/settings';
import PasswordEncoder from '../utils/PasswordEncoder';
import Role from '../models/Role';
import Permission from '../models/Permission';

import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;

export default class UserController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }
  @HasPermission([MANAGE_TECHNICIAN, READ_USER])
  public async user(req: Request) {
    const userId = req.params.userId as string;
    try {
      const user = await dataSources.userDAOService.findById(+userId, {
        include: [
          {
            model: Role,
            include: [Permission],
          },
          {
            model: Partner,
            include: [Contact],
          },
        ],
      });

      if (!user)
        return Promise.reject(
          CustomAPIError.response(`User with Id: ${userId} does not exist`, HttpStatus.NOT_FOUND.code),
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

  @HasPermission([MANAGE_TECHNICIAN, READ_USER, CREATE_USER])
  public async users(req: Request) {
    try {
      const partner = req.user.partner;
      const users = await dataSources.userDAOService.findAll({
        where: {
          partnerId: partner.id,
        },
        include: [Role],
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

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER])
  public async createUser(req: Request) {
    const user = await this.doCreateUser(req);

    const response: HttpResponse<User> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, UPDATE_USER, CREATE_USER])
  public async updateUser(req: Request) {
    const user = await this.doUpdateUser(req);

    const response: HttpResponse<User> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  @TryCatch
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER, DELETE_USER])
  public async deleteUser(req: Request) {
    const user = await this.doDeleteUser(req);

    const response: HttpResponse<any> = {
      code: HttpStatus.OK.code,
      message: HttpStatus.OK.value,
      result: user,
    };

    return response;
  }

  private async doCreateUser(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<UserSchemaType>($saveUserSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findById(value.roleId);

    if (!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

    const userValues: Partial<User> = {
      ...value,
      password: value.password,
      roleId: role.id,
      partnerId: partner.id,
      active: true,
      username: value.email,
    };

    const user = await dataSources.userDAOService.create(userValues as CreationAttributes<User>);

    await role?.$set('users', [user]);
    await user.$set('roles', [role]);

    return user;
  }

  private async doUpdateUser(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<UserSchemaType>($saveUserSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findById(value.roleId);

    const user = await dataSources.userDAOService.findById(value.id);

    if (!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));

    if (!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

    const passwordEncoder = new PasswordEncoder();
    const userValues: Partial<User> = {
      ...value,
      password: await passwordEncoder.encode(value.password),
      roleId: role.id,
      partnerId: partner.id,
    };

    await user.update(userValues);

    await role.$set('users', [user]);

    return user;
  }

  private async doDeleteUser(req: Request) {
    const partner = req.user.partner;

    return dataSources.userDAOService.deleteById(+req.params.id);
  }
}
