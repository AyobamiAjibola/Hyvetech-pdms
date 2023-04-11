import { Request } from 'express';

import dataSources from '../services/dao';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import Partner from '../models/Partner';
import { appCommonTypes } from '../@types/app-common';

import User, { $saveUserSchema, $updateUserSchema, UserSchemaType } from '../models/User';

import Contact from '../models/Contact';
import Joi = require('joi');
import { CreationAttributes, InferAttributes, Op } from 'sequelize';
import { HasPermission, TryCatch } from '../decorators';
import {
  CREATE_CUSTOMER,
  CREATE_USER,
  DELETE_USER,
  MANAGE_TECHNICIAN,
  READ_USER,
  UPDATE_USER,
} from '../config/settings';
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
  @HasPermission([MANAGE_TECHNICIAN, READ_USER, CREATE_CUSTOMER])
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

  @HasPermission([MANAGE_TECHNICIAN, READ_USER, CREATE_USER, CREATE_CUSTOMER])
  public async users(req: Request) {
    try {
      const partner = req.user.partner;
      const users = await dataSources.userDAOService.findAll({
        where: {
          partnerId: partner.id,
        },
        include: [Role],
        order: [['updatedAt', 'DESC']],
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
  @HasPermission([MANAGE_TECHNICIAN, CREATE_USER, CREATE_CUSTOMER])
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
  public async updateUserStatus(req: Request) {
    const user = await this.doUpdateUserStatus(req);

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

    const oldUser = await dataSources.userDAOService.findByAny({
      where: { [Op.or]: [{ email: value.email }, { username: value.email }] },
    });

    if (oldUser) return Promise.reject(CustomAPIError.response('User already exists', HttpStatus.BAD_REQUEST.code));

    const user = await dataSources.userDAOService.create(userValues as CreationAttributes<User>);

    await role?.$add('users', [user]);
    await user.$add('roles', [role]);

    return user;
  }

  private async doUpdateUserStatus(req: Request) {
    const partner = req.user.partner;

    const user = await dataSources.userDAOService.findById(+req.params.userId, { include: [{ model: Role }] });

    if (!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));

    if (
      user.roles[0]?.slug === MANAGE_TECHNICIAN &&
      !req.permissions.map(item => item.name).includes(MANAGE_TECHNICIAN)
    )
      return Promise.reject(
        CustomAPIError.response('Unauthorized access. Please contact system admin', HttpStatus.UNAUTHORIZED.code),
      );

    return dataSources.userDAOService.update(user, {
      active: !user.active,
    } as InferAttributes<User>);
  }

  private async doUpdateUser(req: Request) {
    const partner = req.user.partner;
    const { error, value } = Joi.object<UserSchemaType>($updateUserSchema).validate(req.body);

    if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

    const role = await dataSources.roleDAOService.findById(value.roleId);

    const user = await dataSources.userDAOService.findById(value.id, { include: [{ model: Role }] });

    if (!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));

    if (
      user.roles[0]?.slug === MANAGE_TECHNICIAN &&
      !req.permissions.map(item => item.name).includes(MANAGE_TECHNICIAN)
    )
      return Promise.reject(
        CustomAPIError.response('Unauthorized access. Please contact system admin', HttpStatus.UNAUTHORIZED.code),
      );

    if (!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

    const userValues: Partial<User> = {
      firstName: value.firstName,
      lastName: value.lastName,
      phone: value.phone,

      roleId: role.id,
    };

    if (value.password && value.password.trim() !== '') userValues.password = value.password;

    await dataSources.userDAOService.update(user, userValues as InferAttributes<User>);

    await role.$add('users', [user]);
    await user.$set('roles', [role]);
    return user;
  }

  private async doDeleteUser(req: Request) {
    const partner = req.user.partner;

    return dataSources.userDAOService.deleteById(+req.params.id);
  }
}
